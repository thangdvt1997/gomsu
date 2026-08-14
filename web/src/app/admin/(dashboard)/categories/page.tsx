import { prisma } from "@/lib/db";
import { createCategoryAction, updateCategoryAction, deleteCategoryAction } from "@/lib/actions/admin-categories";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <>
      <div className="admin-topbar">
        <h1>Danh mục</h1>
      </div>
      <div className="admin-panel" style={{ marginBottom: 20 }}>
        <form action={createCategoryAction} style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
          <div className="field" style={{ marginBottom: 0, flex: 1 }}>
            <label>Tên danh mục mới</label>
            <input type="text" name="label" required placeholder="VD: Bình Trang Trí Sân Vườn" />
          </div>
          <button className="btn btn-primary" type="submit">
            Thêm
          </button>
        </form>
      </div>
      <div className="admin-panel">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Slug</th>
              <th>Thứ tự</th>
              <th>Số sản phẩm</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id}>
                <td>
                  <form action={updateCategoryAction.bind(null, c.id)} style={{ display: "flex", gap: 8 }}>
                    <input type="text" name="label" defaultValue={c.label} style={{ padding: 6, borderRadius: 6, border: "1px solid var(--a-line)" }} />
                    <input
                      type="number"
                      name="sortOrder"
                      defaultValue={c.sortOrder}
                      style={{ width: 60, padding: 6, borderRadius: 6, border: "1px solid var(--a-line)" }}
                    />
                    <button className="btn btn-sm btn-outline" type="submit">
                      Lưu
                    </button>
                  </form>
                </td>
                <td>{c.slug}</td>
                <td>{c.sortOrder}</td>
                <td>{c._count.products}</td>
                <td>
                  <form action={deleteCategoryAction.bind(null, c.id)}>
                    <button className="btn btn-sm btn-danger" type="submit" disabled={c._count.products > 0}>
                      Xoá
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
