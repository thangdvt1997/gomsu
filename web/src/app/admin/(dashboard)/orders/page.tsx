import { prisma } from "@/lib/db";
import { formatVnd } from "@/lib/format";
import { markOrderPaidAction, cancelOrderAction } from "@/lib/actions/admin-orders";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <div className="admin-topbar">
        <h1>Đơn hàng ({orders.length})</h1>
      </div>
      <div className="admin-panel">
        <p style={{ color: "var(--a-ink-soft)", fontSize: ".88rem", marginTop: 0 }}>
          Thanh toán qua VietQR là chuyển khoản thủ công — kiểm tra sao kê ngân hàng (nội dung chuyển khoản là mã
          đơn hàng) rồi bấm &quot;Đã nhận tiền&quot; để xác nhận.
        </p>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Số món</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.orderNumber}</td>
                <td>
                  {o.customerName}
                  <br />
                  <span style={{ color: "var(--a-ink-soft)", fontSize: ".8rem" }}>{o.customerPhone}</span>
                </td>
                <td>{o.items.length}</td>
                <td>{formatVnd(o.totalVnd)}</td>
                <td>
                  <span className={`status-badge status-${o.status}`}>{o.status}</span>
                </td>
                <td>{new Intl.DateTimeFormat("vi-VN").format(o.createdAt)}</td>
                <td style={{ display: "flex", gap: 6 }}>
                  {o.status === "PENDING" && (
                    <>
                      <form action={markOrderPaidAction.bind(null, o.id)}>
                        <button className="btn btn-sm btn-primary" type="submit">
                          Đã nhận tiền
                        </button>
                      </form>
                      <form action={cancelOrderAction.bind(null, o.id)}>
                        <button className="btn btn-sm btn-outline" type="submit">
                          Huỷ đơn
                        </button>
                      </form>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", color: "var(--a-ink-soft)" }}>
                  Chưa có đơn hàng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
