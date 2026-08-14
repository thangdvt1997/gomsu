import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import categories from "./seed-data/categories.json";
import glazes from "./seed-data/glaze.json";
import products from "./seed-data/products.json";
import posts from "./seed-data/posts.json";

const prisma = new PrismaClient();

type SeedSize = {
  label: string | null;
  heightCm: number | null;
  mouthCm: number | null;
  priceVnd: number | null;
};

type SeedProduct = {
  slug: string;
  code: string;
  name: string;
  category: string;
  sizes: SeedSize[];
  colors: string[];
  tag: string;
  desc: string;
  featured: boolean;
  imageCount: number;
  borrowedFrom: string | null;
};

async function seedTaxonomies() {
  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { label: c.label, sortOrder: c.sortOrder },
      create: c,
    });
  }
  for (const g of glazes) {
    await prisma.glaze.upsert({
      where: { key: g.key },
      update: { label: g.label, hex: g.hex },
      create: g,
    });
  }
  console.log(`Seeded ${categories.length} categories, ${glazes.length} glazes`);
}

async function seedProducts() {
  const categoryIdBySlug = new Map(
    (await prisma.category.findMany()).map((c) => [c.slug, c.id]),
  );
  const glazeIdByKey = new Map((await prisma.glaze.findMany()).map((g) => [g.key, g.id]));

  // Pass 1: upsert core Product rows so every slug has an id to reference
  // (including for the SIMILAR_TO "borrowed photo" back-references below).
  for (const p of products as SeedProduct[]) {
    const categoryId = categoryIdBySlug.get(p.category);
    if (!categoryId) throw new Error(`Unknown category "${p.category}" for product ${p.slug}`);
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        code: p.code,
        name: p.name,
        categoryId,
        tag: p.tag,
        description: p.desc,
        featured: p.featured,
      },
      create: {
        slug: p.slug,
        code: p.code,
        name: p.name,
        categoryId,
        tag: p.tag,
        description: p.desc,
        featured: p.featured,
      },
    });
  }

  const productIdBySlug = new Map(
    (await prisma.product.findMany()).map((p) => [p.slug, p.id]),
  );

  // Pass 2: replace sizes/colors/images for each product (idempotent — safe to re-run).
  for (const p of products as SeedProduct[]) {
    const productId = productIdBySlug.get(p.slug);
    if (!productId) throw new Error(`Product ${p.slug} missing after upsert`);

    await prisma.productSize.deleteMany({ where: { productId } });
    await prisma.productColor.deleteMany({ where: { productId } });
    await prisma.productImage.deleteMany({ where: { productId } });

    await prisma.productSize.createMany({
      data: p.sizes.map((s, i) => ({
        productId,
        label: s.label,
        heightCm: s.heightCm,
        mouthCm: s.mouthCm,
        priceVnd: s.priceVnd,
        sortOrder: i,
      })),
    });

    for (const [i, colorKey] of p.colors.entries()) {
      const glazeId = glazeIdByKey.get(colorKey);
      if (!glazeId) throw new Error(`Unknown glaze "${colorKey}" for product ${p.slug}`);
      await prisma.productColor.create({
        data: { productId, glazeId, sortOrder: i },
      });
    }

    const borrowedFromProductId = p.borrowedFrom
      ? productIdBySlug.get(p.borrowedFrom)
      : null;
    const images = Array.from({ length: p.imageCount }, (_, i) => {
      const n = i + 1;
      return {
        productId,
        url: `/uploads/products/${p.slug}-${n}.jpg`,
        thumbUrl: `/uploads/products/${p.slug}-${n}-thumb.jpg`,
        alt: p.name,
        sortOrder: i,
        isBorrowed: Boolean(p.borrowedFrom),
        borrowedFromProductId: borrowedFromProductId ?? null,
      };
    });
    if (images.length) await prisma.productImage.createMany({ data: images });
  }

  console.log(`Seeded ${products.length} products`);
}

async function seedPosts() {
  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        contentHtml: post.contentHtml,
        coverImage: post.coverImage,
        publishedAt: new Date(post.publishedAt),
      },
      create: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        contentHtml: post.contentHtml,
        coverImage: post.coverImage,
        publishedAt: new Date(post.publishedAt),
      },
    });
  }
  console.log(`Seeded ${posts.length} posts`);
}

async function seedAdminUser() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.log("ADMIN_EMAIL/ADMIN_PASSWORD not set — skipping admin user seed");
    return;
  }
  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin user ${email} already exists — skipping`);
    return;
  }
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.adminUser.create({
    data: { email, passwordHash, role: "ADMIN" },
  });
  console.log(`Created admin user ${email}`);
}

async function main() {
  await seedTaxonomies();
  await seedProducts();
  await seedPosts();
  await seedAdminUser();
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
