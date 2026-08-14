import { prisma } from "@/lib/db";
import { formatVnd } from "@/lib/format";
import { createCouponAction, toggleCouponActiveAction, deleteCouponAction } from "@/lib/actions/admin-coupons";

export const dynamic = "force-dynamic";

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(d);
}

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <div className="admin-topbar">
        <h1>Mã giảm giá ({coupons.length})</h1>
      </div>

      <div className="admin-panel" style={{ marginBottom: 20 }}>
        <h3 style={{ marginTop: 0 }}>Tạo mã mới</h3>
        <form action={createCouponAction} className="form-row" style={{ gridTemplateColumns: "repeat(3, 1fr)", alignItems: "end" }}>
          <div className="field">
            <label>Mã code *</label>
            <input type="text" name="code" required placeholder="VD: GOMSU10" />
          </div>
          <div className="field">
            <label>Loại</label>
            <select name="type" defaultValue="PERCENT">
              <option value="PERCENT">Giảm theo % </option>
              <option value="FIXED">Giảm số tiền cố định (VND)</option>
            </select>
          </div>
          <div className="field">
            <label>Giá trị *</label>
            <input type="text" name="value" required placeholder="VD: 10 (=10%) hoặc 50000" />
          </div>
          <div className="field">
            <label>Đơn tối thiểu (VND)</label>
            <input type="text" name="minOrderVnd" placeholder="Không giới hạn" />
          </div>
          <div className="field">
            <label>Số lượt dùng tối đa</label>
            <input type="text" name="maxUses" placeholder="Không giới hạn" />
          </div>
          <div className="field">
            <label>Hết hạn</label>
            <input type="date" name="expiresAt" />
          </div>
          <div className="field" style={{ gridColumn: "1/-1" }}>
            <button className="btn btn-primary" type="submit">Tạo mã</button>
          </div>
        </form>
      </div>

      <div className="admin-panel">
        {coupons.length === 0 ? (
          <p style={{ color: "var(--a-ink-soft)", margin: 0 }}>Chưa có mã giảm giá nào.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã</th>
                <th>Giá trị</th>
                <th>Điều kiện</th>
                <th>Đã dùng</th>
                <th>Hết hạn</th>
                <th>Trạng thái</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 700 }}>{c.code}</td>
                  <td>{c.type === "PERCENT" ? `${c.value}%` : formatVnd(c.value)}</td>
                  <td style={{ fontSize: ".85rem", color: "var(--a-ink-soft)" }}>
                    {c.minOrderVnd ? `Đơn tối thiểu ${formatVnd(c.minOrderVnd)}` : "Không điều kiện"}
                  </td>
                  <td>
                    {c.usedCount}
                    {c.maxUses ? ` / ${c.maxUses}` : ""}
                  </td>
                  <td>{c.expiresAt ? formatDate(c.expiresAt) : "Không hết hạn"}</td>
                  <td>
                    <span className={`status-badge ${c.isActive ? "status-CONTACTED" : "status-CLOSED"}`}>
                      {c.isActive ? "Đang bật" : "Đã tắt"}
                    </span>
                  </td>
                  <td style={{ display: "flex", gap: 6 }}>
                    <form action={toggleCouponActiveAction.bind(null, c.id)}>
                      <button className="btn btn-sm btn-outline" type="submit">
                        {c.isActive ? "Tắt" : "Bật"}
                      </button>
                    </form>
                    <form action={deleteCouponAction.bind(null, c.id)}>
                      <button className="btn btn-sm btn-danger" type="submit">Xoá</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
