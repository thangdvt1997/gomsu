import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/site/ProductCard";
import { formatVnd, priceLabel, sizeVariantLabel, sizeDimsText, dimsLabel } from "@/lib/format";
import { COMPANY } from "@/lib/site-config";

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

export async function generateStaticParams() {
  const products = await prisma.product.findMany({ select: { slug: true } });
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  const dims = dimsLabel(product.sizes);
  const price = priceLabel(product.sizes);
  const description =
    product.metaDescription ??
    `${product.tag ?? ""} ${dims ? `${dims}, giá sỉ ${price}.` : ""} Hàng có sẵn tại xưởng gốm Bát Tràng, giao toàn quốc.`.trim();
  const image = product.images[0]?.url;
  return {
    title: product.metaTitle ?? `${product.name} ${product.code} — Lọ Hoa Gốm Sứ Bát Tràng`,
    description,
    alternates: { canonical: `${siteUrl}/san-pham/${product.slug}` },
    openGraph: {
      title: product.metaTitle ?? `${product.name} ${product.code} — Lọ Hoa Gốm Sứ Bát Tràng`,
      description,
      url: `${siteUrl}/san-pham/${product.slug}`,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, isDraft: false, NOT: { id: product.id } },
    select: {
      slug: true,
      code: true,
      name: true,
      featured: true,
      category: { select: { slug: true, label: true } },
      sizes: { select: { label: true, heightCm: true, mouthCm: true, priceVnd: true } },
      colors: { select: { glaze: { select: { key: true, label: true, hex: true } } }, orderBy: { sortOrder: "asc" } },
      images: { select: { url: true, thumbUrl: true }, orderBy: { sortOrder: "asc" }, take: 1 },
    },
    take: 4,
  });

  const prices = product.sizes.map((s) => s.priceVnd).filter((p): p is number => p !== null);
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.name} - ${COMPANY.name}`,
    sku: product.code,
    description: product.tag ?? product.description.slice(0, 200),
    brand: { "@type": "Brand", name: COMPANY.name },
  };
  if (prices.length) {
    jsonLd.offers = {
      "@type": "Offer",
      priceCurrency: "VND",
      price: String(Math.min(...prices)),
      availability: "https://schema.org/InStock",
      url: `${siteUrl}/san-pham/${product.slug}`,
    };
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container" style={{ paddingTop: "calc(var(--header-h) + 26px)" }}>
        <div className="breadcrumb" style={{ color: "var(--ink-faint)" }}>
          <Link href="/">Trang chủ</Link>
          <span>/</span>
          <Link href="/san-pham">Sản phẩm</Link>
          <span>/</span>
          <Link href={`/san-pham?cat=${product.category.slug}`}>{product.category.label}</Link>
          <span>/</span>
          <span>{product.name}</span>
        </div>
        <div className="pd-layout">
          <div className="pd-gallery">
            <div className="pd-main-img">
              <img
                src={product.images[0]?.url ?? "/assets/img/placeholder.svg"}
                alt={`${product.name} - lọ hoa gốm sứ Bát Tràng ${product.code}`}
                data-lightbox={product.images[0]?.url}
                id="pdmain"
              />
            </div>
            {product.images.length > 1 && (
              <div className="pd-thumbs">
                {product.images.map((img, i) => (
                  <button key={img.id} data-full={img.url} className={i === 0 ? "is-active" : ""}>
                    <img src={img.thumbUrl ?? img.url} alt={`${product.name} ảnh ${i + 1}`} loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="pd-info">
            <div className="code-line">
              <span className="code">{product.code}</span>
              <span className="stars">★★★★★</span>
            </div>
            <h1>{product.name}</h1>
            {product.tag && <p className="sub">{product.tag}</p>}
            <div className="pd-price" data-pd-price>
              {priceLabel(product.sizes)}
            </div>
            <p className="pd-price-note">
              Giá bán sỉ, đã bao gồm men màu tiêu chuẩn · Đơn lẻ vui lòng liên hệ
            </p>

            <div className="variant-group">
              <h4>Kích thước</h4>
              <div className="variant-options">
                {product.sizes.map((s) => (
                  <div
                    key={s.id}
                    className="variant-pill"
                    data-dims={sizeDimsText(s) ?? ""}
                    data-price={s.priceVnd !== null ? formatVnd(s.priceVnd) : "Liên hệ"}
                  >
                    {sizeVariantLabel(s, product.sizes.length === 1)}
                  </div>
                ))}
              </div>
            </div>
            <div className="variant-group">
              <h4>Tông men có sẵn</h4>
              <div className="color-options">
                {product.colors.map((c) => (
                  <div key={c.glazeId} className="color-pill">
                    <span className="color-dot" style={{ background: c.glaze.hex }} />
                    {c.glaze.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="qty-row">
              <div className="qty-stepper">
                <button className="qty-minus" aria-label="Giảm số lượng">
                  −
                </button>
                <input type="text" defaultValue={50} inputMode="numeric" aria-label="Số lượng đặt" />
                <button className="qty-plus" aria-label="Tăng số lượng">
                  +
                </button>
              </div>
              <span style={{ fontSize: ".82rem", color: "var(--ink-faint)" }}>
                Số lượng tối thiểu tham khảo cho đơn sỉ
              </span>
            </div>

            <div className="pd-cta">
              <a className="btn btn-primary" href={`https://zalo.me/${COMPANY.zalo}`} target="_blank" rel="noopener">
                Đặt hàng qua Zalo
              </a>
              <a className="btn btn-outline" href={`tel:${COMPANY.phone1Tel}`}>
                Gọi tư vấn {COMPANY.phone1}
              </a>
            </div>

            <table className="pd-meta-table">
              <tbody>
                <tr>
                  <td>Mã hàng</td>
                  <td>{product.code}</td>
                </tr>
                <tr>
                  <td>Chất liệu</td>
                  <td>Gốm sứ Bát Tràng, nung ở nhiệt độ cao</td>
                </tr>
                <tr>
                  <td>Kích thước</td>
                  <td data-pd-dims>{dimsLabel(product.sizes)}</td>
                </tr>
                <tr>
                  <td>Xuất xứ</td>
                  <td>Làng gốm Bát Tràng, Gia Lâm, Hà Nội</td>
                </tr>
                <tr>
                  <td>Đóng gói</td>
                  <td>Chèn xốp/giấy chống sốc, thùng carton chuyên dụng cho gốm sứ</td>
                </tr>
              </tbody>
            </table>

            <div className="trust-row">
              <div>✓ Hàng có sẵn tại xưởng</div>
              <div>✓ Hỗ trợ đổi hàng vỡ vận chuyển</div>
              <div>✓ Xuất hoá đơn theo yêu cầu</div>
            </div>
          </div>
        </div>

        <div className="tabs" data-panels="#pd-panels">
          <button className="tab-btn is-active" data-tab="mota">
            Mô tả chi tiết
          </button>
          <button className="tab-btn" data-tab="thongso">
            Thông số kỹ thuật
          </button>
          <button className="tab-btn" data-tab="baoquan">
            Bảo quản &amp; vệ sinh
          </button>
        </div>
        <div id="pd-panels">
          <div className="tab-panel is-active" data-panel="mota">
            <div className="article-body" style={{ margin: 0, maxWidth: "none" }}>
              <p>{product.description}</p>
            </div>
          </div>
          <div className="tab-panel" data-panel="thongso">
            <div className="spec-list">
              <div>
                <span>Mã hàng</span>
                <span>{product.code}</span>
              </div>
              <div>
                <span>Danh mục</span>
                <span>{product.category.label}</span>
              </div>
              <div>
                <span>Số kích thước</span>
                <span>{product.sizes.length}</span>
              </div>
              <div>
                <span>Chất liệu</span>
                <span>Gốm sứ cao cấp Bát Tràng</span>
              </div>
              <div>
                <span>Kỹ thuật</span>
                <span>Vuốt tay / đổ khuôn, nung ~1200°C</span>
              </div>
              <div>
                <span>Ứng dụng</span>
                <span>Trang trí nội thất, cắm hoa tươi/hoa khô, quà tặng</span>
              </div>
            </div>
          </div>
          <div className="tab-panel" data-panel="baoquan">
            <div className="article-body" style={{ margin: 0, maxWidth: "none" }}>
              <p>
                Lau nhẹ bằng khăn ẩm, tránh dùng vật sắc nhọn cọ xát trực tiếp lên bề mặt men để giữ
                độ bóng lâu dài. Nếu cắm hoa tươi, nên thay nước 2–3 ngày/lần và vệ sinh khô ráo
                trước khi cất trữ để tránh ố cặn bên trong lòng lọ. Đặt ở nơi chắc chắn, tránh va đập
                mạnh; với các mẫu cỡ lớn nên có đế lót chống trượt khi đặt trên mặt sàn bóng.
              </p>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <>
            <hr className="divider" />
            <div className="section-head" data-reveal>
              <span className="eyebrow">Có thể bạn cũng thích</span>
              <h2>Sản Phẩm Cùng Danh Mục</h2>
            </div>
            <div className="related-scroll">
              {related.map((p, i) => (
                <ProductCard key={p.slug} product={p} order={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
