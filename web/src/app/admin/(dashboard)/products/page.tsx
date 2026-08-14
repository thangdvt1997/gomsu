import Link from "next/link";
import { prisma } from "@/lib/db";
import { priceLabel } from "@/lib/format";
import { importProductsCsvAction } from "@/lib/actions/admin-products-csv";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ imported?: string; updated?: string; skipped?: string; importError?: string }>;
}) {
  const { imported, updated, skipped, importError } = await searchParams;

  const products = await prisma.product.findMany({
    include: {
      category: { select: { label: true } },
      sizes: { select: { priceVnd: true, heightCm: true, mouthCm: true } },
      images: { select: { thumbUrl: true, url: true }, orderBy: { sortOrder: "asc" }, take: 1 },
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <>
      <div className="admin-topbar">
        <h1>Sản phẩm ({products.length})</h1>
        <Link className="btn btn-primary" href="/admin/products/new">
          + Thêm sản phẩm
        </Link>
      </div>

      {(imported || updated || skipped) && (
        <div className="admin-panel" style={{ marginBottom: 20 }}>
          <p style={{ margin: 0 }}>
            Đã nhập CSV: <b>{imported}</b> sản phẩm mới, <b>{updated}</b> sản phẩm cập nhật
            {Number(skipped) > 0 && (
              <>
                , <b style={{ color: "#a83232" }}>{skipped}</b> dòng bị bỏ qua (thiếu mã/tên hoặc sai danh mục)
              </>
            )}
            .
          </p>
        </div>
      )}
      {importError && (
        <div className="admin-panel" style={{ marginBottom: 20, borderColor: "#a83232" }}>
          <p style={{ margin: 0, color: "#a83232" }}>Vui lòng chọn một file CSV để nhập.</p>
        </div>
      )}

      <div className="admin-panel" style={{ marginBottom: 20 }}>
        <h3 style={{ marginTop: 0 }}>Xuất / Nhập hàng loạt (CSV)</h3>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
          <a className="btn btn-outline" href="/api/admin/products/export">
            Xuất CSV toàn bộ sản phẩm
          </a>
          <form action={importProductsCsvAction} style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input type="file" name="file" accept=".csv,text/csv" required />
            <button className="btn btn-outline" type="submit">
              Nhập CSV
            </button>
          </form>
        </div>
        <p style={{ fontSize: ".82rem", color: "var(--a-ink-soft)", marginTop: 10, marginBottom: 0 }}>
          Nhập file sẽ cập nhật sản phẩm đã có (khớp theo Mã hàng) hoặc tạo mới nếu mã chưa tồn tại. Nên xuất CSV
          trước để dùng làm mẫu chỉnh sửa.
        </p>
      </div>

      <div className="admin-panel">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ảnh</th>
              <th>Tên</th>
              <th>Mã</th>
              <th>Danh mục</th>
              <th>Giá</th>
              <th>Trạng thái</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>
                  <img src={p.images[0]?.thumbUrl ?? p.images[0]?.url ?? "/assets/img/placeholder.svg"} alt={p.name} />
                </td>
                <td>{p.name}</td>
                <td>{p.code}</td>
                <td>{p.category.label}</td>
                <td>{priceLabel(p.sizes)}</td>
                <td>
                  {p.isDraft && <span className="status-badge status-CLOSED">Nháp</span>}
                  {p.featured && !p.isDraft && <span className="status-badge status-CONTACTED">Nổi bật</span>}
                  {!p.isDraft && !p.featured && "—"}
                </td>
                <td>
                  <Link className="btn btn-sm btn-outline" href={`/admin/products/${p.id}`}>
                    Sửa
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
