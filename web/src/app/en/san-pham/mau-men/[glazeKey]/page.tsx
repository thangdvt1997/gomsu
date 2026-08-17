import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/site/ProductCard";
import { resolveMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { glazeLabel } from "@/lib/i18n";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gomceramic.com";

async function getGlazeWithProducts(glazeKey: string) {
  const glaze = await prisma.glaze.findUnique({ where: { key: glazeKey } });
  if (!glaze) return null;

  const products = await prisma.product.findMany({
    where: { isDraft: false, colors: { some: { glazeId: glaze.id } } },
    select: {
      slug: true,
      code: true,
      name: true,
      nameEn: true,
      featured: true,
      category: { select: { slug: true, label: true } },
      sizes: { select: { label: true, heightCm: true, mouthCm: true, priceVnd: true, stockQty: true } },
      colors: { select: { glaze: { select: { key: true, label: true, hex: true } } }, orderBy: { sortOrder: "asc" } },
      images: { select: { url: true, thumbUrl: true }, orderBy: { sortOrder: "asc" }, take: 1 },
    },
    orderBy: { createdAt: "asc" },
  });

  return { glaze, products };
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ glazeKey: string }>;
}): Promise<Metadata> {
  const { glazeKey } = await params;
  const data = await getGlazeWithProducts(glazeKey);
  if (!data) return {};
  const { glaze, products } = data;
  const label = glazeLabel(glaze.key, glaze.label, "en");
  return resolveMetadata({
    path: `/en/san-pham/mau-men/${glaze.key}`,
    metaTitle: `${label} Ceramic Vases — ${products.length} Bat Trang Designs`,
    metaDescription: `A collection of ${products.length} Bat Trang ceramic vase designs finished in ${label.toLowerCase()} glaze — a range of sizes, wholesale pricing, nationwide shipping.`,
    fallbackTitle: `${label} Glaze Vases`,
    fallbackDescription: `Bat Trang ceramic vases in ${label} glaze.`,
    altLocalePath: `/san-pham/mau-men/${glaze.key}`,
  });
}

export default async function EnglishGlazeLandingPage({
  params,
}: {
  params: Promise<{ glazeKey: string }>;
}) {
  const { glazeKey } = await params;
  const data = await getGlazeWithProducts(glazeKey);
  if (!data) notFound();
  const { glaze, products } = data;
  const label = glazeLabel(glaze.key, glaze.label, "en");

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: `${siteUrl}/en` },
    { name: "Products", url: `${siteUrl}/en/san-pham` },
    { name: `${label} Glaze`, url: `${siteUrl}/en/san-pham/mau-men/${glaze.key}` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <div className="page-hero">
        <img className="bg" src="/media/products/chum-2-tai-2.jpg" alt="" />
        <div className="container">
          <div className="breadcrumb">
            <Link href="/en">Home</Link>
            <span>/</span>
            <Link href="/en/san-pham">Products</Link>
            <span>/</span>
            <span>{label} Glaze</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className="sw" style={{ width: 24, height: 24, background: glaze.hex }} />
            <h1>{label} Glaze Ceramic Vases</h1>
          </div>
          <p style={{ maxWidth: "60ch", color: "rgba(255,255,255,.82)" }}>
            {products.length} Bat Trang ceramic vase designs finished in {label.toLowerCase()} glaze
            — a range of sizes, wholesale pricing.
          </p>
        </div>
      </div>
      <section className="section-tight">
        <div className="container">
          {products.length === 0 ? (
            <div className="empty-state">No products available in this glaze yet.</div>
          ) : (
            <div className="product-grid">
              {products.map((p, i) => (
                <ProductCard key={p.slug} product={p} order={i} locale="en" />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
