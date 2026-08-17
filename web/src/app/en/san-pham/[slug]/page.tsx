import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/site/ProductCard";
import { AddToCartControls } from "@/components/site/AddToCartControls";
import { priceLabel, dimsLabel, stockBadge } from "@/lib/format";
import { COMPANY } from "@/lib/site-config";
import { resolveMetadata, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { WishlistButton } from "@/components/site/WishlistButton";
import { ReviewsSection } from "@/components/site/ReviewsSection";
import { pick, categoryLabel, glazeLabel } from "@/lib/i18n";

const PRODUCT_FAQS_EN = [
  {
    q: "Do you accept single-unit (retail) orders?",
    a: "Yes. The listed price is our bulk wholesale price — for 1-2 units, please message us on Zalo or call our hotline for an accurate retail quote.",
  },
  {
    q: "What's your return policy if an item arrives damaged?",
    a: "We offer a free 1-for-1 replacement if a product is defective or broken in transit — please photograph the item's condition as soon as you receive it and contact us within 48 hours.",
  },
  {
    q: "Can I order a custom glaze color?",
    a: "For bulk orders, we accept custom glaze color requests. Contact us directly to discuss samples and production timing.",
  },
  {
    q: "How long does delivery take?",
    a: "In-stock items typically ship within 2-4 days depending on region. Custom color/quantity orders have their own production timeline, which we'll confirm when your order is placed.",
  },
];

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gomceramic.com";

async function getProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      sizes: { orderBy: { sortOrder: "asc" } },
      colors: { include: { glaze: true }, orderBy: { sortOrder: "asc" } },
      images: { orderBy: { sortOrder: "asc" } },
    },
  });
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  const dims = dimsLabel(product.sizes, "en");
  const price = priceLabel(product.sizes, "en");
  const name = pick(product.name, product.nameEn, "en");
  return resolveMetadata({
    path: `/en/san-pham/${product.slug}`,
    metaTitle: pick(`${product.name} ${product.code} — Lọ Hoa Gốm Sứ Bát Tràng`, product.metaTitleEn, "en"),
    metaDescription: pick(
      `${product.tag ?? ""} ${dims ? `${dims}, giá sỉ ${price}.` : ""}`.trim(),
      product.metaDescriptionEn,
      "en",
    ),
    fallbackTitle: `${name} ${product.code} — Bat Trang Ceramic Vase`,
    fallbackDescription:
      `${pick(product.tag ?? "", product.tagEn, "en")} ${dims ? `${dims}, wholesale price ${price}.` : ""} In stock at our Bat Trang workshop, ships nationwide.`.trim(),
    image: product.images[0]?.url,
    altLocalePath: `/san-pham/${product.slug}`,
  });
}

export default async function EnglishProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const approvedReviews = await prisma.review.findMany({
    where: { productId: product.id, status: "APPROVED" },
    orderBy: { createdAt: "desc" },
  });
  const avgRating = approvedReviews.length
    ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length
    : null;

  const stock = stockBadge(product.sizes);
  const name = pick(product.name, product.nameEn, "en");
  const description = pick(product.description, product.descriptionEn, "en");
  const tag = pick(product.tag ?? "", product.tagEn, "en") || null;
  const categoryLbl = categoryLabel(product.category.slug, product.category.label, "en");

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, isDraft: false, NOT: { id: product.id } },
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
    take: 4,
  });

  const prices = product.sizes.map((s) => s.priceVnd).filter((p): p is number => p !== null);
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${name} - ${COMPANY.name}`,
    sku: product.code,
    description: tag ?? description.slice(0, 200),
    brand: { "@type": "Brand", name: COMPANY.name },
  };
  if (prices.length) {
    jsonLd.offers = {
      "@type": "Offer",
      priceCurrency: "VND",
      price: String(Math.min(...prices)),
      availability: stock?.type === "out" ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      url: `${siteUrl}/en/san-pham/${product.slug}`,
    };
  }
  if (avgRating !== null) {
    jsonLd.aggregateRating = { "@type": "AggregateRating", ratingValue: avgRating.toFixed(1), reviewCount: approvedReviews.length };
  }

  const faq = faqJsonLd(PRODUCT_FAQS_EN.map((f) => ({ question: f.q, answer: f.a })));

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: `${siteUrl}/en` },
    { name: "Products", url: `${siteUrl}/en/san-pham` },
    { name: categoryLbl, url: `${siteUrl}/en/san-pham?cat=${product.category.slug}` },
    { name, url: `${siteUrl}/en/san-pham/${product.slug}` },
  ]);

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumb} />
      <JsonLd data={faq} />
      <div className="container" style={{ paddingTop: "calc(var(--header-h) + 26px)" }}>
        <div className="breadcrumb" style={{ color: "var(--ink-faint)" }}>
          <Link href="/en">Home</Link>
          <span>/</span>
          <Link href="/en/san-pham">Products</Link>
          <span>/</span>
          <Link href={`/en/san-pham?cat=${product.category.slug}`}>{categoryLbl}</Link>
          <span>/</span>
          <span>{name}</span>
        </div>
        <div className="pd-layout">
          <div className="pd-gallery">
            <div className="pd-main-img">
              <img
                src={product.images[0]?.url ?? "/assets/img/placeholder.svg"}
                alt={`${name} - Bat Trang ceramic vase ${product.code}`}
                data-lightbox={product.images[0]?.url}
                id="pdmain"
              />
            </div>
            {product.images.length > 1 && (
              <div className="pd-thumbs">
                {product.images.map((img, i) => (
                  <button key={img.id} data-full={img.url} className={i === 0 ? "is-active" : ""}>
                    <img src={img.thumbUrl ?? img.url} alt={`${name} photo ${i + 1}`} loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="pd-info">
            <div className="code-line">
              <span className="code">{product.code}</span>
              {avgRating !== null ? (
                <span className="stars">
                  {"★".repeat(Math.round(avgRating))}
                  {"☆".repeat(5 - Math.round(avgRating))}
                  <span style={{ color: "var(--ink-faint)", fontSize: ".8rem", marginLeft: 6 }}>
                    ({approvedReviews.length} reviews)
                  </span>
                </span>
              ) : (
                <span className="stars">★★★★★</span>
              )}
              <WishlistButton productSlug={product.slug} />
            </div>
            <h1>{name}</h1>
            {tag && <p className="sub">{tag}</p>}
            <div className="pd-price" data-pd-price>
              {priceLabel(product.sizes, "en")}
            </div>
            <p className="pd-price-note">Wholesale price, includes standard glaze color · Contact us for single-unit orders</p>
            {stock?.type === "out" && <p style={{ color: "#a83232", fontWeight: 700, marginBottom: 16 }}>Currently sold out</p>}
            {stock?.type === "low" && (
              <p style={{ color: "var(--terracotta-dark)", fontWeight: 700, marginBottom: 16 }}>
                Only {stock.qty} left at the workshop
              </p>
            )}

            <AddToCartControls
              productId={product.id}
              productSlug={product.slug}
              productName={name}
              productCode={product.code}
              thumbUrl={product.images[0]?.thumbUrl ?? product.images[0]?.url ?? null}
              sizes={product.sizes}
              colors={product.colors.map((c) => ({ ...c.glaze, label: glazeLabel(c.glaze.key, c.glaze.label, "en") }))}
              locale="en"
            />

            <div className="pd-cta">
              <a className="btn btn-ghost" href={`https://zalo.me/${COMPANY.zalo}`} target="_blank" rel="noopener">
                Order via Zalo
              </a>
              <a className="btn btn-outline" href={`tel:${COMPANY.phone1Tel}`}>
                Call {COMPANY.phone1}
              </a>
            </div>

            <table className="pd-meta-table">
              <tbody>
                <tr>
                  <td>Product code</td>
                  <td>{product.code}</td>
                </tr>
                <tr>
                  <td>Material</td>
                  <td>Bat Trang ceramic, high-temperature fired</td>
                </tr>
                <tr>
                  <td>Dimensions</td>
                  <td data-pd-dims>{dimsLabel(product.sizes, "en")}</td>
                </tr>
                <tr>
                  <td>Origin</td>
                  <td>Bat Trang craft village, Gia Lam, Hanoi</td>
                </tr>
                <tr>
                  <td>Packaging</td>
                  <td>Foam/paper cushioning, ceramics-specific carton box</td>
                </tr>
              </tbody>
            </table>

            <div className="trust-row">
              <div>✓ In stock at the workshop</div>
              <div>✓ 1-for-1 replacement for shipping damage/defects</div>
              <div>✓ Invoice available on request</div>
            </div>
          </div>
        </div>

        <div className="tabs" data-panels="#pd-panels">
          <button className="tab-btn is-active" data-tab="mota">
            Description
          </button>
          <button className="tab-btn" data-tab="thongso">
            Specifications
          </button>
          <button className="tab-btn" data-tab="baoquan">
            Care &amp; Cleaning
          </button>
          <button className="tab-btn" data-tab="faq">
            FAQ
          </button>
        </div>
        <div id="pd-panels">
          <div className="tab-panel is-active" data-panel="mota">
            <div className="article-body" style={{ margin: 0, maxWidth: "none" }}>
              <p>{description}</p>
            </div>
          </div>
          <div className="tab-panel" data-panel="thongso">
            <div className="spec-list">
              <div>
                <span>Product code</span>
                <span>{product.code}</span>
              </div>
              <div>
                <span>Category</span>
                <span>{categoryLbl}</span>
              </div>
              <div>
                <span>Number of sizes</span>
                <span>{product.sizes.length}</span>
              </div>
              <div>
                <span>Material</span>
                <span>Premium Bat Trang ceramic</span>
              </div>
              <div>
                <span>Technique</span>
                <span>Hand-thrown / molded, fired at ~1200°C</span>
              </div>
              <div>
                <span>Use</span>
                <span>Interior décor, fresh/dried flower arranging, gifting</span>
              </div>
            </div>
          </div>
          <div className="tab-panel" data-panel="baoquan">
            <div className="article-body" style={{ margin: 0, maxWidth: "none" }}>
              <p>
                Wipe gently with a damp soft cloth; avoid abrasive scrubbing directly on the glaze
                surface to keep its shine. For fresh flowers, change the water every 2–3 days and dry
                the inside thoroughly before storing to prevent residue buildup. Place on a stable
                surface away from heavy traffic; for larger pieces, use a non-slip pad if placed on
                polished floors.
              </p>
            </div>
          </div>
          <div className="tab-panel" data-panel="faq">
            <div style={{ display: "grid", gap: 18, maxWidth: 760 }}>
              {PRODUCT_FAQS_EN.map((f) => (
                <div key={f.q}>
                  <h4 style={{ marginBottom: 6 }}>{f.q}</h4>
                  <p style={{ color: "var(--ink-soft)", margin: 0 }}>{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <ReviewsSection productId={product.id} productSlug={product.slug} reviews={approvedReviews} locale="en" />

        {related.length > 0 && (
          <>
            <hr className="divider" />
            <div className="section-head" data-reveal>
              <span className="eyebrow">You may also like</span>
              <h2>More From This Category</h2>
            </div>
            <div className="related-scroll">
              {related.map((p, i) => (
                <ProductCard key={p.slug} product={p} order={i} locale="en" />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
