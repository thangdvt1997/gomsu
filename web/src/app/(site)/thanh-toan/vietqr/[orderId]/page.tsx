import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { buildVietQrImageUrl, vietqrConfigured, bankAccountDisplay } from "@/lib/vietqr";
import { formatVnd } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function VietQrPaymentPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } });
  if (!order) notFound();

  const qrImage = vietqrConfigured()
    ? buildVietQrImageUrl({ amountVnd: order.totalVnd, addInfo: order.orderNumber })
    : null;

  return (
    <div className="container" style={{ paddingTop: "calc(var(--header-h) + 40px)", paddingBottom: 60, maxWidth: 640 }}>
      {order.status === "PAID" ? (
        <>
          <h1>Đơn hàng đã được xác nhận thanh toán!</h1>
          <p>
            Đơn <b>{order.orderNumber}</b> — tổng tiền {formatVnd(order.totalVnd)} — xưởng sẽ liên hệ để xác nhận
            giao hàng.
          </p>
        </>
      ) : (
        <>
          <h1>Quét mã chuyển khoản</h1>
          <p style={{ color: "var(--ink-soft)" }}>
            Đơn hàng <b>{order.orderNumber}</b> — tổng tiền <b className="pprice">{formatVnd(order.totalVnd)}</b>.
            Quét mã QR bên dưới bằng app ngân hàng để chuyển khoản đúng số tiền. Xưởng sẽ xác nhận đơn hàng thủ
            công sau khi nhận được tiền (thường trong giờ làm việc).
          </p>
          {qrImage ? (
            <div style={{ textAlign: "center", margin: "30px 0" }}>
              <img
                src={qrImage}
                alt={`Mã VietQR thanh toán đơn ${order.orderNumber}`}
                style={{ maxWidth: 320, borderRadius: "var(--radius-m)", boxShadow: "var(--shadow-m)" }}
              />
              <p style={{ fontSize: ".85rem", color: "var(--ink-faint)", marginTop: 10 }}>
                Nội dung chuyển khoản đã tự động điền: <b>{order.orderNumber}</b>
                {bankAccountDisplay.accountName && (
                  <>
                    <br />
                    Chủ tài khoản: {bankAccountDisplay.accountName}
                  </>
                )}
              </p>
            </div>
          ) : (
            <p style={{ color: "var(--terracotta-dark)" }}>
              Chưa cấu hình tài khoản nhận tiền VietQR. Vui lòng liên hệ xưởng qua Zalo/hotline để đặt hàng.
            </p>
          )}
          <div className="price-table-wrap">
            <table className="price-table">
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {item.productName}
                      {item.sizeLabel && ` (${item.sizeLabel})`}
                    </td>
                    <td>{item.quantity}</td>
                    <td className="pprice">{formatVnd(item.lineTotalVnd)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      <div style={{ marginTop: 24 }}>
        <Link className="btn btn-outline" href="/">
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
