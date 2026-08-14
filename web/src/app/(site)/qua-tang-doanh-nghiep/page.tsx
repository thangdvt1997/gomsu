import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/site/ProductCard";
import { COMPANY } from "@/lib/site-config";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gomceramic.com";

export const metadata: Metadata = {
  title: "Quà Tặng Doanh Nghiệp — Lọ Hoa Gốm Sứ In Logo Theo Yêu Cầu",
  description:
    "Lọ hoa gốm sứ Bát Tràng làm quà tặng doanh nghiệp: in/khắc logo theo yêu cầu, đặt số lượng lớn cho khai trương, hội nghị, quà Tết. Giá sỉ, giao toàn quốc.",
};

export const dynamic = "force-dynamic";

const B2B_FAQS = [
  {
    q: "Số lượng đặt tối thiểu cho quà tặng doanh nghiệp là bao nhiêu?",
    a: "Tuỳ mẫu, thường từ 50 sản phẩm/đơn để đảm bảo chi phí in logo hợp lý. Đơn càng lớn, chi phí trên mỗi sản phẩm càng tốt.",
  },
  {
    q: "Có thể in logo, khắc tên công ty lên sản phẩm không?",
    a: "Có. Xưởng nhận in/khắc logo, thông điệp thương hiệu lên thân lọ theo mẫu thiết kế của doanh nghiệp hoặc do xưởng tư vấn.",
  },
  {
    q: "Thời gian sản xuất và giao hàng mất bao lâu?",
    a: "Với mẫu có sẵn chỉ cần in logo: khoảng 5-7 ngày. Với mẫu đặt riêng theo yêu cầu: 2-3 tuần tuỳ số lượng và độ phức tạp.",
  },
  {
    q: "Có xuất hoá đơn VAT cho doanh nghiệp không?",
    a: "Có, xưởng xuất hoá đơn đầy đủ theo yêu cầu của doanh nghiệp.",
  },
];

export default async function CorporateGiftPage() {
  const featured = await prisma.product.findMany({
    where: { isDraft: false, featured: true },
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
    take: 8,
    orderBy: { createdAt: "asc" },
  });

  const faq = faqJsonLd(B2B_FAQS.map((f) => ({ question: f.q, answer: f.a })));
  const breadcrumb = breadcrumbJsonLd([
    { name: "Trang chủ", url: siteUrl },
    { name: "Quà tặng doanh nghiệp", url: `${siteUrl}/qua-tang-doanh-nghiep` },
  ]);

  return (
    <>
      <JsonLd data={faq} />
      <JsonLd data={breadcrumb} />
      <div className="page-hero">
        <img className="bg" src="/media/site/workshop-3.jpg" alt="" />
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Trang chủ</Link>
            <span>/</span>
            <span>Quà tặng doanh nghiệp</span>
          </div>
          <h1>Quà Tặng Doanh Nghiệp — Lọ Hoa Gốm Sứ In Logo</h1>
          <p style={{ maxWidth: "60ch", color: "rgba(255,255,255,.82)" }}>
            Món quà tinh tế mang đậm bản sắc Việt cho đối tác, khách hàng, nhân viên — in/khắc logo thương hiệu
            theo yêu cầu, số lượng lớn cho khai trương, hội nghị, quà Tết.
          </p>
          <div className="hero-cta" style={{ marginTop: 20 }}>
            <a className="btn btn-primary" href={`https://zalo.me/${COMPANY.zalo}`} target="_blank" rel="noopener">
              Nhắn Zalo tư vấn ngay
            </a>
            <Link className="btn btn-ghost" href="/lien-he">
              Gửi yêu cầu báo giá
            </Link>
          </div>
        </div>
      </div>

      <section className="section-tight">
        <div className="container">
          <div className="value-grid">
            <div className="value-card">
              <h3>In/khắc logo theo yêu cầu</h3>
              <p>Đưa thương hiệu doanh nghiệp lên từng sản phẩm — tư vấn thiết kế miễn phí.</p>
            </div>
            <div className="value-card">
              <h3>Giá ưu đãi theo số lượng</h3>
              <p>Càng đặt nhiều, chi phí trên mỗi sản phẩm càng tốt — phù hợp ngân sách quà tặng hàng loạt.</p>
            </div>
            <div className="value-card">
              <h3>Đóng gói sang trọng</h3>
              <p>Hộp quà riêng theo yêu cầu, phù hợp trao tặng đối tác, khách VIP.</p>
            </div>
            <div className="value-card">
              <h3>Xuất hoá đơn VAT</h3>
              <p>Đầy đủ chứng từ, thuận tiện hạch toán chi phí quà tặng của doanh nghiệp.</p>
            </div>
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="section-tight bg-alt">
          <div className="container">
            <div className="section-head" data-reveal>
              <span className="eyebrow">Mẫu gợi ý</span>
              <h2>Sản Phẩm Phù Hợp Làm Quà Tặng</h2>
            </div>
            <div className="product-grid">
              {featured.map((p, i) => (
                <ProductCard key={p.slug} product={p} order={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-tight">
        <div className="container">
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <div className="section-head" data-reveal>
              <span className="eyebrow">Giải đáp</span>
              <h2>Câu Hỏi Thường Gặp</h2>
            </div>
            <div style={{ display: "grid", gap: 18 }}>
              {B2B_FAQS.map((f) => (
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
          <div
            className="cta-band"
            style={{ background: "linear-gradient(120deg, var(--terracotta) 0%, var(--terracotta-dark) 100%)" }}
          >
            <div>
              <h2>Cần báo giá quà tặng doanh nghiệp?</h2>
              <p>Gửi số lượng và ý tưởng thiết kế, xưởng tư vấn và báo giá trong ngày làm việc.</p>
            </div>
            <Link className="btn btn-outline" href="/lien-he">
              Gửi yêu cầu ngay
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
