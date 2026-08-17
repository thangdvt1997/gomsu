import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/site/ProductCard";
import { categoryLabel } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Bat Trang Ceramic Vase Workshop | Wholesale & Retail Nationwide",
  description:
    "Bat Trang ceramic vase workshop with 60+ designs across sizes and glazes. Factory-direct wholesale pricing, custom designs, nationwide shipping in Vietnam.",
  alternates: { languages: { vi: "/", en: "/en" } },
};

export const dynamic = "force-dynamic";

const productSelect = {
  slug: true,
  code: true,
  name: true,
  nameEn: true,
  featured: true,
  category: { select: { slug: true, label: true } },
  sizes: { select: { label: true, heightCm: true, mouthCm: true, priceVnd: true, stockQty: true } },
  colors: { select: { glaze: { select: { key: true, label: true, hex: true } } }, orderBy: { sortOrder: "asc" as const } },
  images: { select: { url: true, thumbUrl: true }, orderBy: { sortOrder: "asc" as const }, take: 1 },
};

export default async function EnglishHomePage() {
  const [categories, featured, testimonials] = await Promise.all([
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.product.findMany({
      where: { featured: true, isDraft: false },
      select: productSelect,
      take: 9,
      orderBy: { createdAt: "asc" },
    }),
    prisma.review.findMany({
      where: { status: "APPROVED" },
      include: { product: { select: { name: true, nameEn: true, slug: true } } },
      orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
      take: 3,
    }),
  ]);

  const heroImages = [
    "/media/products/chum-2-tai-1.jpg",
    "/media/products/bau-tron-1.jpg",
    "/media/products/lo-tulip-1.jpg",
    "/media/products/lo-ho-lo-1.jpg",
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
          <span className="eyebrow">Bat Trang Ceramic Workshop · 20+ years of craft</span>
          <h1>Bat Trang Ceramic Vases — Beautiful in Every Brushstroke and Glaze</h1>
          <p className="lead">
            Gốm Sứ Trung Mừng produces and wholesales 60+ handcrafted ceramic vase designs, from
            tabletop pieces to large statement vases for lobbies and event spaces. Bulk wholesale
            orders, nationwide shipping, and custom designs on request.
          </p>
          <div className="hero-cta">
            <Link className="btn btn-primary" href="/en/san-pham">
              Browse All Products
            </Link>
            <Link className="btn btn-ghost" href="/en/lien-he">
              Request Wholesale Quote
            </Link>
          </div>
          <div className="hero-stats">
            <div>
              <b data-count-to="60" data-suffix="+">0</b>
              <span>vase designs</span>
            </div>
            <div>
              <b data-count-to="20" data-suffix="+">0</b>
              <span>years of craft</span>
            </div>
            <div>
              <b data-count-to="13" data-suffix="+">0</b>
              <span>signature glazes</span>
            </div>
            <div>
              <b data-count-to="63" data-suffix="">0</b>
              <span>provinces shipped to</span>
            </div>
          </div>
        </div>
        <div className="hero-dots">
          {heroImages.map((src, i) => (
            <button key={src} className={i === 0 ? "is-active" : ""} aria-label={`Image ${i + 1}`} />
          ))}
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <div className="chip-row" data-reveal>
            {categories.map((c) => (
              <Link key={c.slug} className="chip" href={`/en/san-pham?cat=${c.slug}`}>
                {categoryLabel(c.slug, c.label, "en")}
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
              <h3>Direct from the workshop</h3>
              <p>No middlemen — factory-direct pricing from our Bat Trang kiln, full control over output and delivery timing.</p>
            </div>
            <div className="value-card" data-reveal>
              <div className="ic">🎨</div>
              <h3>60+ designs, 13 glazes</h3>
              <p>From matte to crackled to glossy glazes — there's always a design and color to fit your store's style.</p>
            </div>
            <div className="value-card" data-reveal>
              <div className="ic">📦</div>
              <h3>Breakage-proof packing</h3>
              <p>A packing process built specifically for ceramics, so long-distance nationwide shipping is worry-free.</p>
            </div>
            <div className="value-card" data-reveal>
              <div className="ic">🤝</div>
              <h3>Custom designs welcome</h3>
              <p>Custom sizes and glaze colors available for bulk wholesale orders.</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="section-head" data-reveal>
            <span className="eyebrow">Best sellers</span>
            <h2>Featured Products</h2>
            <p>The most-ordered designs from our Bat Trang ceramic vase collection.</p>
          </div>
          <div className="product-grid" data-reveal>
            {featured.map((p, i) => (
              <ProductCard key={p.slug} product={p} order={i} locale="en" />
            ))}
          </div>
          <div className="text-center" style={{ marginTop: 40 }}>
            <Link className="btn btn-outline" href="/en/san-pham">
              View All 60+ Designs
            </Link>
          </div>
        </div>
      </section>

      {testimonials.length > 0 && (
        <section>
          <div className="container">
            <div className="section-head center" data-reveal>
              <span className="eyebrow">What customers say</span>
              <h2>Trusted by Customers Nationwide</h2>
            </div>
            <div className="testimonial-grid" data-reveal>
              {testimonials.map((t) => (
                <div className="testimonial-card" key={t.id}>
                  <span className="quote-mark">&ldquo;</span>
                  <div className="stars" style={{ marginBottom: 10 }}>
                    {"★".repeat(t.rating)}
                    {"☆".repeat(5 - t.rating)}
                  </div>
                  {t.title && <h4 style={{ marginBottom: 6 }}>{t.title}</h4>}
                  <p style={{ color: "var(--ink-soft)" }}>{t.comment}</p>
                  <div className="testimonial-author">
                    <b>{t.customerName}</b>
                    {t.product && (
                      <Link href={`/en/san-pham/${t.product.slug}`}>
                        Purchased {t.product.nameEn || t.product.name}
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-alt">
        <div className="container">
          <div className="section-head center" data-reveal>
            <span className="eyebrow">Real spaces</span>
            <h2>Ceramics in Everyday Living Spaces</h2>
            <p>A few moments of Bat Trang vases styled by customers in real interiors.</p>
          </div>
          <div className="about-gallery" data-reveal>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <img
                key={n}
                className={n === 1 || n === 4 ? "tall" : ""}
                src={`/media/site/lifestyle-${n}.jpg`}
                alt={`Bat Trang ceramics decor space ${n}`}
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
              <h2>Need a bulk wholesale quote?</h2>
              <p>Send us your designs, quantity and delivery area — we&apos;ll reply with a quote within 30 business minutes.</p>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a className="btn btn-ghost" href="tel:0342869889">
                Call +84 34 286 9889
              </a>
              <Link className="btn btn-outline" href="/en/lien-he">
                Request a Quote
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
