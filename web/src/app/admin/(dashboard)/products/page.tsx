import Link from "next/link";
import { prisma } from "@/lib/db";
import { priceLabel } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
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
