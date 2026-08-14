import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatVnd } from "@/lib/format";
import { markOrderPaidAction, cancelOrderAction, updateOrderInternalNoteAction } from "@/lib/actions/admin-orders";

export const dynamic = "force-dynamic";

function formatDateTime(d: Date) {
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(d);
}

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, coupon: true },
  });
  if (!order) notFound();

  const utmEntries = [
    ["Nguồn (utm_source)", order.utmSource],
    ["Kênh (utm_medium)", order.utmMedium],
    ["Chiến dịch (utm_campaign)", order.utmCampaign],
    ["Từ khoá (utm_term)", order.utmTerm],
    ["Nội dung (utm_content)", order.utmContent],
    ["Google Click ID", order.gclid],
    ["Facebook Click ID", order.fbclid],
  ].filter(([, v]) => v) as [string, string][];

  return (
    <>
      <div className="admin-topbar">
        <h1>Đơn hàng {order.orderNumber}</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <Link className="btn btn-outline" href={`/admin/orders/${order.id}/print`} target="_blank">
            In hoá đơn
          </Link>
          {order.status === "PENDING" && (
            <>
              <form action={markOrderPaidAction.bind(null, order.id)}>
                <button className="btn btn-primary" type="submit">Đã nhận tiền</button>
              </form>
              <form action={cancelOrderAction.bind(null, order.id)}>
                <button className="btn btn-danger" type="submit">Huỷ đơn</button>
              </form>
            </>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "start" }}>
        <div>
          <div className="admin-panel" style={{ marginBottom: 20 }}>
            <h3 style={{ marginTop: 0 }}>Sản phẩm</h3>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>SL</th>
                  <th>Đơn giá</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {item.productName}
                      {item.sizeLabel && ` (${item.sizeLabel})`}
                      {item.glazeLabel && ` - ${item.glazeLabel}`}
                    </td>
                    <td>{item.quantity}</td>
                    <td>{formatVnd(item.unitPriceVnd)}</td>
                    <td>{formatVnd(item.lineTotalVnd)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ textAlign: "right", marginTop: 14, fontSize: ".92rem" }}>
              <div>Tạm tính: {formatVnd(order.subtotalVnd)}</div>
              {order.discountVnd > 0 && (
                <div>
                  Giảm giá {order.coupon ? `(${order.coupon.code})` : ""}: -{formatVnd(order.discountVnd)}
                </div>
              )}
              <div style={{ fontSize: "1.1rem", fontWeight: 700, marginTop: 4 }}>
                Tổng cộng: {formatVnd(order.totalVnd)}
              </div>
            </div>
          </div>

          {order.paymentProofUrl && (
            <div className="admin-panel" style={{ marginBottom: 20 }}>
              <h3 style={{ marginTop: 0 }}>Ảnh chứng minh chuyển khoản</h3>
              <img src={order.paymentProofUrl} alt="Ảnh chuyển khoản" style={{ maxWidth: 320, borderRadius: 8 }} />
            </div>
          )}

          {utmEntries.length > 0 && (
            <div className="admin-panel" style={{ marginBottom: 20 }}>
              <h3 style={{ marginTop: 0 }}>Nguồn quảng cáo/chiến dịch</h3>
              <table className="admin-table">
                <tbody>
                  {utmEntries.map(([label, value]) => (
                    <tr key={label}>
                      <td style={{ color: "var(--a-ink-soft)" }}>{label}</td>
                      <td>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div>
          <div className="admin-panel" style={{ marginBottom: 20 }}>
            <h3 style={{ marginTop: 0 }}>Khách hàng</h3>
            <p style={{ margin: "4px 0" }}><b>{order.customerName}</b></p>
            <p style={{ margin: "4px 0" }}>{order.customerPhone}</p>
            {order.customerEmail && <p style={{ margin: "4px 0" }}>{order.customerEmail}</p>}
            <p style={{ margin: "4px 0", color: "var(--a-ink-soft)" }}>{order.shippingAddress}</p>
            {order.note && (
              <>
                <h4 style={{ marginBottom: 4 }}>Ghi chú của khách</h4>
                <p style={{ margin: 0, color: "var(--a-ink-soft)" }}>{order.note}</p>
              </>
            )}
            <p style={{ marginTop: 12, fontSize: ".82rem", color: "var(--a-ink-soft)" }}>
              Đặt lúc: {formatDateTime(order.createdAt)}
              {order.paidAt && (
                <>
                  <br />
                  Đã nhận tiền: {formatDateTime(order.paidAt)}
                </>
              )}
            </p>
          </div>

          <div className="admin-panel">
            <h3 style={{ marginTop: 0 }}>Ghi chú nội bộ</h3>
            <p style={{ fontSize: ".82rem", color: "var(--a-ink-soft)", marginTop: 0 }}>
              Chỉ admin thấy, không hiển thị cho khách hàng.
            </p>
            <form action={updateOrderInternalNoteAction.bind(null, order.id)}>
              <div className="field">
                <textarea name="internalNote" rows={4} defaultValue={order.internalNote ?? ""} />
              </div>
              <button className="btn btn-outline btn-block" type="submit">Lưu ghi chú</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
