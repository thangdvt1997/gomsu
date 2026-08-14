import { prisma } from "@/lib/db";
import { createGlazeAction, updateGlazeAction, deleteGlazeAction } from "@/lib/actions/admin-glaze";

export const dynamic = "force-dynamic";

export default async function AdminGlazePage() {
  const glazes = await prisma.glaze.findMany({
    orderBy: { label: "asc" },
    include: { _count: { select: { colors: true } } },
  });

  return (
    <>
      <div className="admin-topbar">
        <h1>Tông men</h1>
      </div>
      <div className="admin-panel" style={{ marginBottom: 20 }}>
        <form action={createGlazeAction} style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
          <div className="field" style={{ marginBottom: 0, flex: 1 }}>
            <label>Tên tông men mới</label>
            <input type="text" name="label" required placeholder="VD: Men Rạn Cổ" />
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Mã màu</label>
            <input type="color" name="hex" defaultValue="#CFC7B0" />
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
              <th>Màu</th>
              <th>Tên</th>
              <th>Key</th>
              <th>Số sản phẩm</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {glazes.map((g) => (
              <tr key={g.id}>
                <td colSpan={2}>
                  <form action={updateGlazeAction.bind(null, g.id)} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input type="color" name="hex" defaultValue={g.hex} />
                    <input type="text" name="label" defaultValue={g.label} style={{ padding: 6, borderRadius: 6, border: "1px solid var(--a-line)" }} />
                    <button className="btn btn-sm btn-outline" type="submit">
                      Lưu
                    </button>
                  </form>
                </td>
                <td>{g.key}</td>
                <td>{g._count.colors}</td>
                <td>
                  <form action={deleteGlazeAction.bind(null, g.id)}>
                    <button className="btn btn-sm btn-danger" type="submit" disabled={g._count.colors > 0}>
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
