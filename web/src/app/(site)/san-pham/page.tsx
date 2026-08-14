import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/site/ProductCard";

export const metadata: Metadata = {
  title: "Sản Phẩm — Hơn 60 Mẫu Lọ Hoa Gốm Sứ Bát Tràng",
  description:
    "Danh mục đầy đủ hơn 60 mẫu lọ hoa gốm sứ Bát Tràng: mini để bàn, cổ điển men loang, dáng độc lạ, bộ sưu tập và dòng cao cấp trang trí. Lọc theo danh mục, giá, tông men.",
};

export const dynamic = "force-dynamic";

const PRICE_BUCKETS = [
  { value: "under30", label: "Dưới 30.000đ" },
  { value: "30to60", label: "30.000 – 60.000đ" },
  { value: "60to120", label: "60.000 – 120.000đ" },
  { value: "over120", label: "Trên 120.000đ" },
];

export default async function CatalogPage() {
  const [categories, glazes, products] = await Promise.all([
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.glaze.findMany(),
    prisma.product.findMany({
      where: { isDraft: false },
      select: {
        slug: true,
        code: true,
        name: true,
        featured: true,
        category: { select: { slug: true, label: true } },
        sizes: { select: { label: true, heightCm: true, mouthCm: true, priceVnd: true } },
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
        <img className="bg" src="/uploads/products/chum-2-tai-2-thumb.jpg" alt="" />
        <div className="container">
          <div className="breadcrumb">
            <a href="/">Trang chủ</a>
            <span>/</span>
            <span>Sản phẩm</span>
          </div>
          <h1>Toàn Bộ Bộ Sưu Tập Lọ Hoa Gốm Sứ</h1>
          <p style={{ maxWidth: "60ch", color: "rgba(255,255,255,.82)" }}>
            {products.length} mẫu lọ hoa gốm sứ Bát Tràng — từ mini để bàn đến trang trí sảnh lớn,
            đầy đủ kích thước, men màu và mức giá sỉ.
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
                placeholder="Tìm theo tên hoặc mã hàng..."
                data-catalog-search
                aria-label="Tìm sản phẩm"
              />
            </div>
            <h4>Danh mục</h4>
            <div className="chip-row" style={{ flexDirection: "column", alignItems: "flex-start", gap: 8 }}>
              <button className="chip is-active" data-catalog-chip="all">
                Tất cả ({products.length})
              </button>
              {categories.map((c) => (
                <button key={c.slug} className="chip" data-catalog-chip={c.slug}>
                  {c.label} ({categoryCounts.get(c.slug) ?? 0})
                </button>
              ))}
            </div>
            <h4>Khoảng giá</h4>
            <div className="filter-list price-range">
              {PRICE_BUCKETS.map((b) => (
                <label key={b.value}>
                  <input type="checkbox" data-catalog-check="price" value={b.value} /> {b.label}
                </label>
              ))}
            </div>
            <h4>Tông men</h4>
            <div className="filter-list">
              {glazes.map((g) => (
                <label key={g.key}>
                  <input type="checkbox" data-catalog-check="color" value={g.key} />{" "}
                  <span className="sw" style={{ display: "inline-block", background: g.hex }} /> {g.label}
                </label>
              ))}
            </div>
          </aside>
          <div>
            <div className="toolbar">
              <span className="result-count">
                <b data-catalog-count>{products.length}</b> sản phẩm
              </span>
              <select className="sort-select" data-catalog-sort aria-label="Sắp xếp">
                <option value="default">Mặc định</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
                <option value="name-asc">Tên A–Z</option>
              </select>
            </div>
            <div className="product-grid" data-catalog-grid>
              {products.map((p, i) => (
                <ProductCard key={p.slug} product={p} order={i} />
              ))}
            </div>
            <div className="empty-state" data-catalog-empty style={{ display: "none" }}>
              Không tìm thấy sản phẩm phù hợp. Vui lòng thử bộ lọc khác.
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
