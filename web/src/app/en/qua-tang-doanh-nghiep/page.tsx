import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/site/ProductCard";
import { COMPANY } from "@/lib/site-config";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gomceramic.com";

export const metadata: Metadata = {
  title: "Corporate Gifts — Custom Logo Ceramic Vases",
  description:
    "Bat Trang ceramic vases for corporate gifting: custom logo printing/engraving, bulk orders for grand openings, conferences, Tet gifts. Wholesale pricing, nationwide shipping.",
  alternates: { languages: { vi: "/qua-tang-doanh-nghiep", en: "/en/qua-tang-doanh-nghiep" } },
};

export const dynamic = "force-dynamic";

const B2B_FAQS_EN = [
  {
    q: "What's the minimum order for corporate gifts?",
    a: "Usually starting from 50 units per order to keep logo-printing costs reasonable. Larger orders bring the per-unit cost down further.",
  },
  {
    q: "Can you print or engrave our company logo on the product?",
    a: "Yes. We print/engrave your logo or brand message onto the vase body based on your design, or our own design assistance.",
  },
  {
    q: "How long does production and delivery take?",
    a: "For existing designs with just a logo added: about 5-7 days. For fully custom designs: 2-3 weeks depending on quantity and complexity.",
  },
  {
    q: "Can you issue a VAT invoice for our company?",
    a: "Yes, we issue a full invoice as required by your company.",
  },
];

export default async function EnglishCorporateGiftPage() {
  const featured = await prisma.product.findMany({
    where: { isDraft: false, featured: true },
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
    take: 8,
    orderBy: { createdAt: "asc" },
  });

  const faq = faqJsonLd(B2B_FAQS_EN.map((f) => ({ question: f.q, answer: f.a })));
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: `${siteUrl}/en` },
    { name: "Corporate Gifts", url: `${siteUrl}/en/qua-tang-doanh-nghiep` },
  ]);

  return (
    <>
      <JsonLd data={faq} />
      <JsonLd data={breadcrumb} />
      <div className="page-hero">
        <img className="bg" src="/media/site/workshop-3.jpg" alt="" />
        <div className="container">
          <div className="breadcrumb">
            <Link href="/en">Home</Link>
            <span>/</span>
            <span>Corporate Gifts</span>
          </div>
          <h1>Corporate Gifts — Custom Logo Ceramic Vases</h1>
          <p style={{ maxWidth: "60ch", color: "rgba(255,255,255,.82)" }}>
            An elegant gift with authentic Vietnamese character for partners, clients and staff —
            custom logo printing/engraving, bulk orders for grand openings, conferences, Tet gifts.
          </p>
          <div className="hero-cta" style={{ marginTop: 20 }}>
            <a className="btn btn-primary" href={`https://zalo.me/${COMPANY.zalo}`} target="_blank" rel="noopener">
              Chat on Zalo Now
            </a>
            <Link className="btn btn-ghost" href="/en/lien-he">
              Request a Quote
            </Link>
          </div>
        </div>
      </div>

      <section className="section-tight">
        <div className="container">
          <div className="value-grid">
            <div className="value-card">
              <h3>Custom logo printing/engraving</h3>
              <p>Put your brand on every product — free design consultation.</p>
            </div>
            <div className="value-card">
              <h3>Volume-based pricing</h3>
              <p>The more you order, the better the per-unit cost — fits bulk gifting budgets.</p>
            </div>
            <div className="value-card">
              <h3>Premium packaging</h3>
              <p>Custom gift boxes available, suitable for VIP clients and partners.</p>
            </div>
            <div className="value-card">
              <h3>VAT invoices</h3>
              <p>Full documentation provided, convenient for corporate expense accounting.</p>
            </div>
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="section-tight bg-alt">
          <div className="container">
            <div className="section-head" data-reveal>
              <span className="eyebrow">Suggested designs</span>
              <h2>Products Suited for Corporate Gifting</h2>
            </div>
            <div className="product-grid">
              {featured.map((p, i) => (
                <ProductCard key={p.slug} product={p} order={i} locale="en" />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-tight">
        <div className="container">
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <div className="section-head" data-reveal>
              <span className="eyebrow">FAQ</span>
              <h2>Frequently Asked Questions</h2>
            </div>
            <div style={{ display: "grid", gap: 18 }}>
              {B2B_FAQS_EN.map((f) => (
                <div key={f.q}>
                  <h4 style={{ marginBottom: 6 }}>{f.q}</h4>
                  <p style={{ color: "var(--ink-soft)", margin: 0 }}>{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <div className="cta-band" style={{ background: "linear-gradient(120deg, var(--terracotta) 0%, var(--terracotta-dark) 100%)" }}>
            <div>
              <h2>Need a corporate gift quote?</h2>
              <p>Send us your quantity and design ideas — we&apos;ll consult and quote within the business day.</p>
            </div>
            <Link className="btn btn-outline" href="/en/lien-he">
              Send a Request
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
