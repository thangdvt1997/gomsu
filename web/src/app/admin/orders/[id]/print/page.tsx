import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatVnd } from "@/lib/format";
import { COMPANY } from "@/lib/site-config";

export const dynamic = "force-dynamic";

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(d);
}

export default async function PrintInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true, coupon: true } });
  if (!order) notFound();

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: 24, fontFamily: "Arial, sans-serif", color: "#222" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.4rem" }}>{COMPANY.name}</h1>
          <p style={{ margin: "4px 0", fontSize: ".85rem", color: "#666" }}>{COMPANY.address}</p>
          <p style={{ margin: "4px 0", fontSize: ".85rem", color: "#666" }}>
            {COMPANY.phone1} · {COMPANY.email}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <h2 style={{ margin: 0, fontSize: "1.2rem" }}>PHIẾU GIAO HÀNG</h2>
          <p style={{ margin: "4px 0", fontSize: ".9rem" }}>
            Đơn: <b>{order.orderNumber}</b>
          </p>
          <p style={{ margin: "4px 0", fontSize: ".85rem", color: "#666" }}>{formatDate(order.createdAt)}</p>
        </div>
      </div>

      <table style={{ width: "100%", marginBottom: 20, fontSize: ".9rem" }}>
        <tbody>
          <tr>
            <td style={{ color: "#666", paddingRight: 12 }}>Khách hàng</td>
            <td>
              <b>{order.customerName}</b> — {order.customerPhone}
            </td>
          </tr>
          <tr>
            <td style={{ color: "#666", paddingRight: 12, verticalAlign: "top" }}>Địa chỉ giao</td>
            <td>{order.shippingAddress}</td>
          </tr>
          {order.note && (
            <tr>
              <td style={{ color: "#666", paddingRight: 12 }}>Ghi chú</td>
              <td>{order.note}</td>
            </tr>
          )}
        </tbody>
      </table>

      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".9rem" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #333" }}>
            <th style={{ textAlign: "left", padding: "8px 4px" }}>Sản phẩm</th>
            <th style={{ textAlign: "center", padding: "8px 4px" }}>SL</th>
            <th style={{ textAlign: "right", padding: "8px 4px" }}>Đơn giá</th>
            <th style={{ textAlign: "right", padding: "8px 4px" }}>Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={item.id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "8px 4px" }}>
                {item.productName}
                {item.sizeLabel && ` (${item.sizeLabel})`}
              </td>
              <td style={{ textAlign: "center", padding: "8px 4px" }}>{item.quantity}</td>
              <td style={{ textAlign: "right", padding: "8px 4px" }}>{formatVnd(item.unitPriceVnd)}</td>
              <td style={{ textAlign: "right", padding: "8px 4px" }}>{formatVnd(item.lineTotalVnd)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ textAlign: "right", marginTop: 16, fontSize: ".92rem" }}>
        <p style={{ margin: "4px 0" }}>Tạm tính: {formatVnd(order.subtotalVnd)}</p>
        {order.discountVnd > 0 && (
          <p style={{ margin: "4px 0" }}>
            Giảm giá {order.coupon ? `(${order.coupon.code})` : ""}: -{formatVnd(order.discountVnd)}
          </p>
        )}
        <p style={{ margin: "4px 0", fontSize: "1.15rem", fontWeight: 700 }}>Tổng cộng: {formatVnd(order.totalVnd)}</p>
      </div>

      <p style={{ marginTop: 40, fontSize: ".82rem", color: "#666", textAlign: "center" }}>
        Cảm ơn quý khách đã mua hàng tại {COMPANY.name}!
      </p>

      <script
        dangerouslySetInnerHTML={{
          __html: `window.onload = function(){ window.print(); };`,
        }}
      />
    </div>
  );
}
