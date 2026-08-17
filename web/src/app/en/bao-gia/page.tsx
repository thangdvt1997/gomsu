import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { priceRowParts } from "@/lib/format";
import { COMPANY } from "@/lib/site-config";
import { faqJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { pick, categoryLabel } from "@/lib/i18n";

const WHOLESALE_FAQS_EN = [
  {
    q: "What's the minimum wholesale order quantity?",
    a: "Depending on the design and size, the typical suggested minimum is 50 units per design. For large or mixed-design/color orders, our team will advise specifics via Zalo/hotline.",
  },
  {
    q: "Do you offer logo printing / corporate gifts?",
    a: "Yes. We print/engrave corporate logos onto products for grand-opening, conference or Tet gift orders — please contact us to discuss design samples and production timing.",
  },
  {
    q: "Are shipping costs included in the listed prices?",
    a: "Listed prices don't include shipping. Shipping fees are quoted based on quantity, weight and delivery region when the order is finalized.",
  },
  {
    q: "How do I pay for a wholesale order?",
    a: "We accept bank transfer via VietQR, confirmed manually once payment is received. For large orders, a deposit followed by balance-on-delivery can be arranged.",
  },
];

export const metadata: Metadata = {
  title: "2026 Ceramic Vase Wholesale Price List",
  description:
    "Updated wholesale price list from Gốm Sứ Trung Mừng workshop — prices apply to bulk orders, contact us for further discounts on large quantities.",
  alternates: { languages: { vi: "/bao-gia", en: "/en/bao-gia" } },
};

export const dynamic = "force-dynamic";

export default async function EnglishWholesalePage() {
  const products = await prisma.product.findMany({
    where: { isDraft: false },
    select: {
      slug: true,
      code: true,
      name: true,
      nameEn: true,
      category: { select: { slug: true, label: true } },
      sizes: { select: { label: true, heightCm: true, mouthCm: true, priceVnd: true }, orderBy: { sortOrder: "asc" } },
      images: { select: { thumbUrl: true, url: true }, orderBy: { sortOrder: "asc" }, take: 1 },
    },
    orderBy: { createdAt: "asc" },
  });

  const faq = faqJsonLd(WHOLESALE_FAQS_EN.map((f) => ({ question: f.q, answer: f.a })));

  return (
    <>
      <JsonLd data={faq} />
      <div className="page-hero">
        <img className="bg" src="/media/site/workshop-3.jpg" alt="" />
        <div className="container">
          <div className="breadcrumb">
            <Link href="/en">Home</Link>
            <span>/</span>
            <span>Wholesale</span>
          </div>
          <h1>2026 Ceramic Vase Wholesale Price List</h1>
          <p style={{ maxWidth: "64ch", color: "rgba(255,255,255,.82)" }}>
            Updated from the {COMPANY.name} workshop price list — {COMPANY.addressEn}. Prices apply
            to bulk wholesale orders; contact us for further discounts on large quantities.
          </p>
        </div>
      </div>
      <section className="section-tight">
        <div className="container">
          <div className="price-table-wrap">
            <table className="price-table">
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Size / Price</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const name = pick(p.name, p.nameEn, "en");
                  return (
                    <tr key={p.slug}>
                      <td>
                        <img src={p.images[0]?.thumbUrl ?? p.images[0]?.url} alt={name} loading="lazy" />
                      </td>
                      <td>
                        <Link className="pname" href={`/en/san-pham/${p.slug}`}>
                          {name}
                        </Link>
                        <br />
                        <span style={{ color: "var(--ink-faint)", fontSize: ".78rem" }}>{p.code}</span>
                      </td>
                      <td>{categoryLabel(p.category.slug, p.category.label, "en")}</td>
                      <td>
                        {p.sizes.map((s, i) => {
                          const { dims, price } = priceRowParts(s, "en");
                          return (
                            <span key={i}>
                              {i > 0 && <br />}
                              {dims && `${dims} — `}
                              <b className="pprice">{price}</b>
                            </span>
                          );
                        })}
                      </td>
                      <td>
                        <Link className="btn btn-sm btn-outline" href={`/en/san-pham/${p.slug}`}>
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ maxWidth: 760, margin: "60px auto 0" }}>
            <div className="section-head" data-reveal>
              <span className="eyebrow">FAQ</span>
              <h2>Wholesale Order FAQ</h2>
            </div>
            <div style={{ display: "grid", gap: 18 }}>
              {WHOLESALE_FAQS_EN.map((f) => (
                <div key={f.q}>
                  <h4 style={{ marginBottom: 6 }}>{f.q}</h4>
                  <p style={{ color: "var(--ink-soft)", margin: 0 }}>{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
