import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/site/ProductCard";
import { resolveMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";

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

// Dedicated landing page per glaze color -- faceted-attribute SEO pattern
// (matches how CB2/West Elm build /color/white-vases style pages) to catch
// long-tail searches like "lọ hoa men xanh cổ vịt" that the JS-filtered
// catalog page alone can't rank for (no distinct crawlable URL per filter).
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
  return resolveMetadata({
    path: `/san-pham/mau-men/${glaze.key}`,
    metaTitle: `Lọ Hoa Gốm Sứ Men ${glaze.label} — ${products.length} Mẫu Bát Tràng`,
    metaDescription: `Bộ sưu tập ${products.length} mẫu lọ hoa gốm sứ Bát Tràng tông men ${glaze.label.toLowerCase()} — đa dạng kích thước, giá bán sỉ, giao hàng toàn quốc.`,
    fallbackTitle: `Lọ hoa men ${glaze.label}`,
    fallbackDescription: `Lọ hoa gốm sứ Bát Tràng tông men ${glaze.label}.`,
  });
}

export default async function GlazeLandingPage({
  params,
}: {
  params: Promise<{ glazeKey: string }>;
}) {
  const { glazeKey } = await params;
  const data = await getGlazeWithProducts(glazeKey);
  if (!data) notFound();
  const { glaze, products } = data;

  const breadcrumb = breadcrumbJsonLd([
    { name: "Trang chủ", url: siteUrl },
    { name: "Sản phẩm", url: `${siteUrl}/san-pham` },
    { name: `Men ${glaze.label}`, url: `${siteUrl}/san-pham/mau-men/${glaze.key}` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <div className="page-hero">
        <img className="bg" src="/media/products/chum-2-tai-2.jpg" alt="" />
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Trang chủ</Link>
            <span>/</span>
            <Link href="/san-pham">Sản phẩm</Link>
            <span>/</span>
            <span>Men {glaze.label}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className="sw" style={{ width: 24, height: 24, background: glaze.hex }} />
            <h1>Lọ Hoa Gốm Sứ Tông Men {glaze.label}</h1>
          </div>
          <p style={{ maxWidth: "60ch", color: "rgba(255,255,255,.82)" }}>
            {products.length} mẫu lọ hoa gốm sứ Bát Tràng hoàn thiện với tông men {glaze.label.toLowerCase()} —
            đa dạng kích thước, giá bán sỉ.
          </p>
        </div>
      </div>
      <section className="section-tight">
        <div className="container">
          {products.length === 0 ? (
            <div className="empty-state">Chưa có sản phẩm nào với tông men này.</div>
          ) : (
            <div className="product-grid">
              {products.map((p, i) => (
                <ProductCard key={p.slug} product={p} order={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
