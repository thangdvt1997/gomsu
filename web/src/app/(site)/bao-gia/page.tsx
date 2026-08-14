import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { priceRowParts } from "@/lib/format";
import { COMPANY } from "@/lib/site-config";
import { faqJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";

const WHOLESALE_FAQS = [
  {
    q: "Số lượng đặt sỉ tối thiểu là bao nhiêu?",
    a: "Tuỳ mẫu và kích thước, số lượng tối thiểu tham khảo thường từ 50 chiếc/mẫu. Đơn hàng lớn hoặc pha nhiều mẫu/màu sẽ được xưởng tư vấn cụ thể qua Zalo/hotline.",
  },
  {
    q: "Có nhận in logo, làm quà tặng doanh nghiệp không?",
    a: "Có. Xưởng nhận in/khắc logo doanh nghiệp lên sản phẩm cho đơn quà tặng khai trương, hội nghị, quà Tết — vui lòng liên hệ để trao đổi mẫu thiết kế và thời gian sản xuất.",
  },
  {
    q: "Giá trong bảng đã bao gồm vận chuyển chưa?",
    a: "Giá niêm yết chưa bao gồm phí vận chuyển. Phí ship sẽ được báo cụ thể theo số lượng, trọng lượng và khu vực giao hàng khi chốt đơn.",
  },
  {
    q: "Thanh toán đơn sỉ như thế nào?",
    a: "Xưởng nhận chuyển khoản qua VietQR, xác nhận thủ công sau khi nhận tiền. Với đơn số lượng lớn có thể thoả thuận đặt cọc trước và thanh toán phần còn lại khi nhận hàng.",
  },
];

export const metadata: Metadata = {
  title: "Bảng Giá Sỉ Lọ Hoa Gốm Sứ 2026",
  description:
    "Cập nhật từ bảng giá xưởng Gốm Sứ Trung Mừng — giá áp dụng cho đơn đặt sỉ, số lượng lớn vui lòng liên hệ để nhận chiết khấu thêm.",
};

export const dynamic = "force-dynamic";

export default async function BaoGiaPage() {
  const products = await prisma.product.findMany({
    where: { isDraft: false },
    select: {
      slug: true,
      code: true,
      name: true,
      category: { select: { label: true } },
      sizes: { select: { label: true, heightCm: true, mouthCm: true, priceVnd: true }, orderBy: { sortOrder: "asc" } },
      images: { select: { thumbUrl: true, url: true }, orderBy: { sortOrder: "asc" }, take: 1 },
    },
    orderBy: { createdAt: "asc" },
  });

  const faq = faqJsonLd(WHOLESALE_FAQS.map((f) => ({ question: f.q, answer: f.a })));

  return (
    <>
      <JsonLd data={faq} />
      <div className="page-hero">
        <img className="bg" src="/media/site/workshop-3.jpg" alt="" />
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Trang chủ</Link>
            <span>/</span>
            <span>Bảng giá sỉ</span>
          </div>
          <h1>Bảng Giá Sỉ Lọ Hoa Gốm Sứ 2026</h1>
          <p style={{ maxWidth: "64ch", color: "rgba(255,255,255,.82)" }}>
            Cập nhật từ bảng giá xưởng {COMPANY.name} — {COMPANY.address}. Giá áp dụng cho đơn
            đặt sỉ, số lượng lớn vui lòng liên hệ để nhận chiết khấu thêm.
          </p>
        </div>
      </div>
      <section className="section-tight">
        <div className="container">
          <div className="price-table-wrap">
            <table className="price-table">
              <thead>
                <tr>
                  <th>Ảnh</th>
                  <th>Sản phẩm</th>
                  <th>Danh mục</th>
                  <th>Kích thước / Giá</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.slug}>
                    <td>
                      <img src={p.images[0]?.thumbUrl ?? p.images[0]?.url} alt={p.name} loading="lazy" />
                    </td>
                    <td>
                      <Link className="pname" href={`/san-pham/${p.slug}`}>
                        {p.name}
                      </Link>
                      <br />
                      <span style={{ color: "var(--ink-faint)", fontSize: ".78rem" }}>{p.code}</span>
                    </td>
                    <td>{p.category.label}</td>
                    <td>
                      {p.sizes.map((s, i) => {
                        const { dims, price } = priceRowParts(s);
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
                      <Link className="btn btn-sm btn-outline" href={`/san-pham/${p.slug}`}>
                        Xem
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ maxWidth: 760, margin: "60px auto 0" }}>
            <div className="section-head" data-reveal>
              <span className="eyebrow">Giải đáp</span>
              <h2>Câu Hỏi Thường Gặp Về Đơn Sỉ</h2>
            </div>
            <div style={{ display: "grid", gap: 18 }}>
              {WHOLESALE_FAQS.map((f) => (
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
