import { prisma } from "@/lib/db";
import { formatVnd } from "@/lib/format";

export const dynamic = "force-dynamic";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export default async function AdminDashboardPage() {
  const since = new Date(Date.now() - THIRTY_DAYS_MS);

  const [productCount, orderCount, newLeadCount, postCount, pendingReviewCount, topItems, paidOrders] =
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
    ]);

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
