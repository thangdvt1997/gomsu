import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/site/ProductCard";

export const metadata: Metadata = {
  title: "Xưởng Lọ Hoa Gốm Sứ Bát Tràng | Sỉ & Lẻ Toàn Quốc",
  description:
    "Xưởng sản xuất lọ hoa gốm sứ Bát Tràng, hơn 60 mẫu mã đa dạng kích thước và men màu. Bán sỉ giá gốc, nhận đặt mẫu riêng, giao hàng toàn quốc.",
};

const productSelect = {
  slug: true,
  code: true,
  name: true,
  featured: true,
  category: { select: { slug: true, label: true } },
  sizes: { select: { label: true, heightCm: true, mouthCm: true, priceVnd: true } },
  colors: { select: { glaze: { select: { key: true, label: true, hex: true } } }, orderBy: { sortOrder: "asc" as const } },
  images: { select: { url: true, thumbUrl: true }, orderBy: { sortOrder: "asc" as const }, take: 1 },
};

export default async function HomePage() {
  const [categories, featured] = await Promise.all([
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.product.findMany({
      where: { featured: true, isDraft: false },
      select: productSelect,
      take: 9,
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const heroImages = [
    "/uploads/products/chum-2-tai-1.jpg",
    "/uploads/products/bau-tron-1.jpg",
    "/uploads/products/lo-tulip-1.jpg",
    "/uploads/products/lo-ho-lo-1.jpg",
  ];

  return (
    <>
      <section className="hero">
        <div className="hero-slides">
          {heroImages.map((src, i) => (
            <div
              key={src}
              className={`hero-slide${i === 0 ? " is-active" : ""}`}
              style={{ backgroundImage: `url('${src}')` }}
            />
          ))}
        </div>
        <div className="container hero-content">
          <span className="eyebrow">Xưởng gốm Bát Tràng · hơn 20 năm kinh nghiệm</span>
          <h1>Lọ Hoa Gốm Sứ Bát Tràng — Đẹp Từ Nét Vẽ Đến Từng Đường Men</h1>
          <p className="lead">
            Gốm Sứ Trung Mừng sản xuất &amp; phân phối sỉ hơn 60 mẫu lọ hoa gốm sứ thủ công, đủ
            kích cỡ từ để bàn tới trang trí sảnh lớn. Đặt sỉ số lượng lớn, giao hàng toàn quốc, hỗ
            trợ mẫu riêng theo yêu cầu.
          </p>
          <div className="hero-cta">
            <Link className="btn btn-primary" href="/san-pham">
              Xem toàn bộ sản phẩm
            </Link>
            <Link className="btn btn-ghost" href="/lien-he">
              Nhận báo giá sỉ
            </Link>
          </div>
          <div className="hero-stats">
            <div>
              <b>60+</b>
              <span>mẫu lọ hoa</span>
            </div>
            <div>
              <b>20+</b>
              <span>năm làm nghề</span>
            </div>
            <div>
              <b>13+</b>
              <span>tông men đặc trưng</span>
            </div>
            <div>
              <b>63</b>
              <span>tỉnh thành giao hàng</span>
            </div>
          </div>
        </div>
        <div className="hero-dots">
          {heroImages.map((src, i) => (
            <button key={src} className={i === 0 ? "is-active" : ""} aria-label={`Ảnh ${i + 1}`} />
          ))}
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <div className="chip-row" data-reveal>
            {categories.map((c) => (
              <Link key={c.slug} className="chip" href={`/san-pham?cat=${c.slug}`}>
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-alt">
        <div className="container">
          <div className="value-grid">
            <div className="value-card" data-reveal>
              <div className="ic">🏺</div>
              <h3>Xưởng sản xuất trực tiếp</h3>
              <p>Không qua trung gian — giá gốc tại lò Bát Tràng, chủ động sản lượng và tiến độ giao hàng.</p>
            </div>
            <div className="value-card" data-reveal>
              <div className="ic">🎨</div>
              <h3>60+ mẫu, 13 tông men</h3>
              <p>Từ men mát, men sôi tới men khô — luôn có mẫu và màu phù hợp phong cách cửa hàng của bạn.</p>
            </div>
            <div className="value-card" data-reveal>
              <div className="ic">📦</div>
              <h3>Đóng gói chống vỡ</h3>
              <p>Quy trình đóng gói riêng cho gốm sứ, an tâm vận chuyển đường dài toàn quốc.</p>
            </div>
            <div className="value-card" data-reveal>
              <div className="ic">🤝</div>
              <h3>Nhận đặt mẫu riêng</h3>
              <p>Tuỳ chỉnh kích thước, màu men theo yêu cầu cho đơn sỉ số lượng lớn.</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="section-head" data-reveal>
            <span className="eyebrow">Bán chạy nhất</span>
            <h2>Sản Phẩm Nổi Bật</h2>
            <p>Những mẫu được đặt nhiều nhất trong bộ sưu tập lọ hoa gốm sứ Bát Tràng của xưởng.</p>
          </div>
          <div className="product-grid" data-reveal>
            {featured.map((p, i) => (
              <ProductCard key={p.slug} product={p} order={i} />
            ))}
          </div>
          <div className="text-center" style={{ marginTop: 40 }}>
            <Link className="btn btn-outline" href="/san-pham">
              Xem tất cả 60+ mẫu
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-alt">
        <div className="container">
          <div className="section-head center" data-reveal>
            <span className="eyebrow">Không gian thực tế</span>
            <h2>Gốm Sứ Trong Từng Góc Sống</h2>
            <p>Một vài khoảnh khắc lọ hoa Bát Tràng được khách hàng bày trí trong không gian thật.</p>
          </div>
          <div className="about-gallery" data-reveal>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <img
                key={n}
                className={n === 1 || n === 4 ? "tall" : ""}
                src={`/uploads/site/lifestyle-${n}.jpg`}
                alt={`Không gian trang trí gốm sứ Bát Tràng ${n}`}
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="cta-band" data-reveal>
            <div>
              <h2>Cần báo giá sỉ số lượng lớn?</h2>
              <p>Gửi mẫu, số lượng và khu vực giao hàng — xưởng phản hồi báo giá trong vòng 30 phút làm việc.</p>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a className="btn btn-ghost" href="tel:0342869889">
                Gọi 034.286.9889
              </a>
              <Link className="btn btn-outline" href="/lien-he">
                Gửi yêu cầu báo giá
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
