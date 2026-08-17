import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { buildVietQrImageUrl, vietqrConfigured, bankAccountDisplay } from "@/lib/vietqr";
import { formatVnd } from "@/lib/format";
import { uploadPaymentProofAction } from "@/lib/actions/upload-payment-proof";

export const dynamic = "force-dynamic";

export default async function EnglishVietQrPaymentPage({
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
          <h1>Payment Confirmed!</h1>
          <p>
            Order <b>{order.orderNumber}</b> — total {formatVnd(order.totalVnd)} — our team will contact you to
            confirm delivery.
          </p>
        </>
      ) : (
        <>
          <h1>Scan to Pay via Bank Transfer</h1>
          <p style={{ color: "var(--ink-soft)" }}>
            Order <b>{order.orderNumber}</b> — total <b className="pprice">{formatVnd(order.totalVnd)}</b>. Scan the
            QR code below with your Vietnamese banking app to transfer the exact amount (VietQR works with Vietnamese
            bank accounts). We&apos;ll confirm your order manually once payment is received (usually within business
            hours).
          </p>
          {qrImage ? (
            <div style={{ textAlign: "center", margin: "30px 0" }}>
              <img
                src={qrImage}
                alt={`VietQR payment code for order ${order.orderNumber}`}
                style={{ maxWidth: 320, borderRadius: "var(--radius-m)", boxShadow: "var(--shadow-m)" }}
              />
              <p style={{ fontSize: ".85rem", color: "var(--ink-faint)", marginTop: 10 }}>
                Transfer note pre-filled: <b>{order.orderNumber}</b>
                {bankAccountDisplay.accountName && (
                  <>
                    <br />
                    Account holder: {bankAccountDisplay.accountName}
                  </>
                )}
              </p>
            </div>
          ) : (
            <p style={{ color: "var(--terracotta-dark)" }}>
              VietQR payment account not configured yet. Please contact us via Zalo/hotline to place your order.
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

          <div
            style={{
              marginTop: 24,
              background: "var(--paper)",
              border: "1px solid var(--line)",
              borderRadius: "var(--radius-m)",
              padding: 22,
            }}
          >
            <h3 style={{ marginTop: 0 }}>Already transferred? Send us a screenshot</h3>
            <p style={{ color: "var(--ink-soft)", fontSize: ".88rem" }}>
              This helps us reconcile and confirm your order faster (optional).
            </p>
            {order.paymentProofUrl ? (
              <>
                <img
                  src={order.paymentProofUrl}
                  alt="Submitted transfer screenshot"
                  style={{ maxWidth: 240, borderRadius: 8, marginBottom: 10 }}
                />
                <p style={{ color: "var(--sage-dark)", fontWeight: 600, fontSize: ".88rem" }}>
                  Screenshot received — thank you!
                </p>
              </>
            ) : (
              <form
                action={uploadPaymentProofAction.bind(null, order.id)}
                style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}
              >
                <input type="file" name="file" accept="image/*" required />
                <button className="btn btn-outline btn-sm" type="submit">
                  Send Transfer Screenshot
                </button>
              </form>
            )}
          </div>
        </>
      )}
      <div style={{ marginTop: 24 }}>
        <Link className="btn btn-outline" href="/en">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
