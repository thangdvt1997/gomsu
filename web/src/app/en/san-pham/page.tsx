import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/site/ProductCard";
import { categoryLabel, glazeLabel } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Products — 60+ Bat Trang Ceramic Vase Designs",
  description:
    "Full catalog of 60+ Bat Trang ceramic vase designs: mini tabletop, classic drip glaze, unique shapes, curated sets and premium décor. Filter by category, price, glaze.",
  alternates: { languages: { vi: "/san-pham", en: "/en/san-pham" } },
};

export const dynamic = "force-dynamic";

const PRICE_BUCKETS = [
  { value: "under30", label: "Under 30,000₫" },
  { value: "30to60", label: "30,000 – 60,000₫" },
  { value: "60to120", label: "60,000 – 120,000₫" },
  { value: "over120", label: "Over 120,000₫" },
];

export default async function EnglishCatalogPage() {
  const [categories, glazes, products] = await Promise.all([
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.glaze.findMany(),
    prisma.product.findMany({
      where: { isDraft: false },
      select: {
        slug: true,
        code: true,
        name: true,
        nameEn: true,
        featured: true,
        category: { select: { slug: true, label: true } },
        sizes: { select: { label: true, heightCm: true, mouthCm: true, priceVnd: true, stockQty: true } },
        colors: {
          select: { glaze: { select: { key: true, label: true, hex: true } } },
          orderBy: { sortOrder: "asc" },
        },
        images: { select: { url: true, thumbUrl: true }, orderBy: { sortOrder: "asc" }, take: 1 },
      },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const categoryCounts = new Map<string, number>();
  for (const p of products) {
    categoryCounts.set(p.category.slug, (categoryCounts.get(p.category.slug) ?? 0) + 1);
  }

  return (
    <>
      <div className="page-hero">
        <img className="bg" src="/media/products/chum-2-tai-2.jpg" alt="" />
        <div className="container">
          <div className="breadcrumb">
            <a href="/en">Home</a>
            <span>/</span>
            <span>Products</span>
          </div>
          <h1>The Full Ceramic Vase Collection</h1>
          <p style={{ maxWidth: "60ch", color: "rgba(255,255,255,.82)" }}>
            {products.length} Bat Trang ceramic vase designs — from mini tabletop pieces to large
            statement vases for lobbies, in every size, glaze color and wholesale price point.
          </p>
        </div>
      </div>
      <section className="section-tight">
        <div className="container catalog-layout">
          <aside className="filter-box">
            <div className="search-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                placeholder="Search by name or code..."
                data-catalog-search
                aria-label="Search products"
              />
            </div>
            <h4>Category</h4>
            <div className="chip-row" style={{ flexDirection: "column", alignItems: "flex-start", gap: 8 }}>
              <button className="chip is-active" data-catalog-chip="all">
                All ({products.length})
              </button>
              {categories.map((c) => (
                <button key={c.slug} className="chip" data-catalog-chip={c.slug}>
                  {categoryLabel(c.slug, c.label, "en")} ({categoryCounts.get(c.slug) ?? 0})
                </button>
              ))}
            </div>
            <h4>Price range</h4>
            <div className="filter-list price-range">
              {PRICE_BUCKETS.map((b) => (
                <label key={b.value}>
                  <input type="checkbox" data-catalog-check="price" value={b.value} /> {b.label}
                </label>
              ))}
            </div>
            <h4>Glaze color</h4>
            <div className="filter-list">
              {glazes.map((g) => (
                <label key={g.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span>
                    <input type="checkbox" data-catalog-check="color" value={g.key} />{" "}
                    <span className="sw" style={{ display: "inline-block", background: g.hex }} />{" "}
                    {glazeLabel(g.key, g.label, "en")}
                  </span>
                  <Link
                    href={`/en/san-pham/mau-men/${g.key}`}
                    style={{ fontSize: ".76rem", color: "var(--terracotta-dark)", textDecoration: "underline" }}
                  >
                    View all
                  </Link>
                </label>
              ))}
            </div>
          </aside>
          <div>
            <div className="toolbar">
              <span className="result-count">
                <b data-catalog-count>{products.length}</b> products
              </span>
              <select className="sort-select" data-catalog-sort aria-label="Sort">
                <option value="default">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name A–Z</option>
              </select>
            </div>
            <div className="product-grid" data-catalog-grid>
              {products.map((p, i) => (
                <ProductCard key={p.slug} product={p} order={i} locale="en" />
              ))}
            </div>
            <div className="empty-state" data-catalog-empty style={{ display: "none" }}>
              No matching products found. Please try different filters.
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
