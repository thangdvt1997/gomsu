"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { parseProductsCsv } from "@/lib/product-csv";

const COMBINING_MARKS = /[̀-ͯ]/g;

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/đ/g, "d")
    .normalize("NFD")
    .replace(COMBINING_MARKS, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Bulk create/update products from a CSV export (see /api/admin/products/export
// for the exact column format). Matches existing products by `code`
// (unique); unknown categories/glaze keys are skipped per-row rather than
// failing the whole import, so one bad row doesn't block the other 59.
export async function importProductsCsvAction(formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) redirect("/admin/products?importError=1");

  const text = await (file as File).text();
  const rows = parseProductsCsv(text);

  const [categories, glazes] = await Promise.all([prisma.category.findMany(), prisma.glaze.findMany()]);
  const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));
  const glazeByKey = new Map(glazes.map((g) => [g.key, g]));

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const row of rows) {
    if (!row.code || !row.name) {
      skipped++;
      continue;
    }
    const category = categoryBySlug.get(row.categorySlug);
    if (!category) {
      skipped++;
      continue;
    }
    const matchedGlazes = row.colorKeys.map((k) => glazeByKey.get(k)).filter((g): g is NonNullable<typeof g> => !!g);

    const existing = await prisma.product.findUnique({ where: { code: row.code } });

    const baseData = {
      name: row.name,
      categoryId: category.id,
      tag: row.tag,
      description: row.description,
      featured: row.featured,
      isDraft: row.isDraft,
      metaTitle: row.metaTitle,
      metaDescription: row.metaDescription,
    };

    if (existing) {
      await prisma.$transaction([
        prisma.product.update({ where: { id: existing.id }, data: baseData }),
        prisma.productSize.deleteMany({ where: { productId: existing.id } }),
        prisma.productColor.deleteMany({ where: { productId: existing.id } }),
        ...(row.sizes.length
          ? [
              prisma.productSize.createMany({
                data: row.sizes.map((s, i) => ({ ...s, productId: existing.id, sortOrder: i })),
              }),
            ]
          : []),
        ...(matchedGlazes.length
          ? [
              prisma.productColor.createMany({
                data: matchedGlazes.map((g, i) => ({ productId: existing.id, glazeId: g.id, sortOrder: i })),
              }),
            ]
          : []),
      ]);
      updated++;
    } else {
      await prisma.product.create({
        data: {
          ...baseData,
          code: row.code,
          slug: slugify(row.name),
          sizes: { create: row.sizes },
          colors: { create: matchedGlazes.map((g, i) => ({ glazeId: g.id, sortOrder: i })) },
        },
      });
      created++;
    }
  }

  revalidatePath("/admin/products");
  revalidatePath("/san-pham");
  redirect(`/admin/products?imported=${created}&updated=${updated}&skipped=${skipped}`);
}
