import { prisma } from "@/lib/db";
import { formatVnd, LOW_STOCK_THRESHOLD } from "@/lib/format";

export const dynamic = "force-dynamic";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export default async function AdminDashboardPage() {
  const since = new Date(Date.now() - THIRTY_DAYS_MS);

  const [productCount, orderCount, newLeadCount, postCount, pendingReviewCount, topItems, paidOrders, lowStockSizes] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.lead.count({ where: { status: "NEW" } }),
      prisma.post.count(),
      prisma.review.count({ where: { status: "PENDING" } }),
      prisma.orderItem.groupBy({
        by: ["productId", "productName"],
        where: { order: { createdAt: { gte: since }, status: { not: "CANCELLED" } } },
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
      }),
      prisma.order.findMany({
        where: { createdAt: { gte: since }, status: { not: "CANCELLED" } },
        select: { totalVnd: true, utmSource: true, utmMedium: true },
      }),
      prisma.productSize.findMany({
        where: { stockQty: { not: null, lte: LOW_STOCK_THRESHOLD } },
        include: { product: { select: { id: true, name: true, isDraft: true } } },
        orderBy: { stockQty: "asc" },
      }),
    ]);

  const activeLowStock = lowStockSizes.filter((s) => !s.product.isDraft);

  const revenueByChannel = new Map<string, number>();
  for (const o of paidOrders) {
    const channel = o.utmSource ? `${o.utmSource}${o.utmMedium ? ` / ${o.utmMedium}` : ""}` : "Trực tiếp / không rõ nguồn";
    revenueByChannel.set(channel, (revenueByChannel.get(channel) ?? 0) + o.totalVnd);
  }
  const channelRows = [...revenueByChannel.entries()].sort((a, b) => b[1] - a[1]);

  return (
    <>
      <div className="admin-topbar">
        <h1>Tổng quan</h1>
      </div>
      <div className="admin-stats">
        <div className="admin-stat">
          <b>{productCount}</b>
          <span>Sản phẩm</span>
        </div>
        <div className="admin-stat">
          <b>{orderCount}</b>
          <span>Đơn hàng</span>
        </div>
        <div className="admin-stat">
          <b>{newLeadCount}</b>
          <span>Liên hệ mới</span>
        </div>
        <div className="admin-stat">
          <b>{postCount}</b>
          <span>Bài viết</span>
        </div>
      </div>

      {pendingReviewCount > 0 && (
        <div className="admin-panel" style={{ marginBottom: 20, borderColor: "var(--a-accent)" }}>
          <p style={{ margin: 0 }}>
            Có <b>{pendingReviewCount}</b> đánh giá khách hàng đang chờ duyệt —{" "}
            <a href="/admin/reviews" style={{ color: "var(--a-accent-dark)", fontWeight: 700 }}>
              xem ngay
            </a>
            .
          </p>
        </div>
      )}

      {activeLowStock.length > 0 && (
        <div className="admin-panel" style={{ marginBottom: 20, borderColor: "#a83232" }}>
          <h3 style={{ marginTop: 0 }}>⚠ Sắp hết hàng / hết hàng ({activeLowStock.length})</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Size</th>
                <th>Còn lại</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {activeLowStock.map((s) => (
                <tr key={s.id}>
                  <td>{s.product.name}</td>
                  <td>{s.label ?? "—"}</td>
                  <td style={{ color: s.stockQty === 0 ? "#a83232" : "#8a6100", fontWeight: 700 }}>
                    {s.stockQty === 0 ? "Hết hàng" : s.stockQty}
                  </td>
                  <td>
                    <a className="btn btn-sm btn-outline" href={`/admin/products/${s.product.id}`}>
                      Cập nhật
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div className="admin-panel">
          <h3 style={{ marginTop: 0 }}>Bán chạy 30 ngày qua</h3>
          {topItems.length === 0 ? (
            <p style={{ color: "var(--a-ink-soft)", margin: 0 }}>Chưa có đơn hàng nào trong 30 ngày qua.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Đã bán</th>
                </tr>
              </thead>
              <tbody>
                {topItems.map((row) => (
                  <tr key={row.productId}>
                    <td>{row.productName}</td>
                    <td>{row._sum.quantity ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="admin-panel">
          <h3 style={{ marginTop: 0 }}>Doanh thu theo nguồn (30 ngày)</h3>
          {channelRows.length === 0 ? (
            <p style={{ color: "var(--a-ink-soft)", margin: 0 }}>Chưa có dữ liệu.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nguồn / kênh</th>
                  <th>Doanh thu</th>
                </tr>
              </thead>
              <tbody>
                {channelRows.map(([channel, revenue]) => (
                  <tr key={channel}>
                    <td>{channel}</td>
                    <td>{formatVnd(revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
