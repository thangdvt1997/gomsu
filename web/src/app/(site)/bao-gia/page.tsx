import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { priceRowParts } from "@/lib/format";
import { COMPANY } from "@/lib/site-config";

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

  return (
    <>
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
        </div>
      </section>
    </>
  );
}
