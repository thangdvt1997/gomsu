import { prisma } from "@/lib/db";
import { formatVnd, LOW_STOCK_THRESHOLD } from "@/lib/format";
import { IconTrendingUp, IconClock, IconMessage, IconStar, IconBox, IconFileText, IconCart, IconAlert } from "@/components/admin/AdminIcons";

export const dynamic = "force-dynamic";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export default async function AdminDashboardPage() {
  const since = new Date(Date.now() - THIRTY_DAYS_MS);
  const todayStart = startOfToday();

  const [
    productCount,
    orderCount,
    postCount,
    newLeadCount,
    pendingReviewCount,
    pendingOrderCount,
    revenue30d,
    revenueToday,
    topItems,
    channelOrders,
    lowStockSizes,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.post.count(),
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.review.count({ where: { status: "PENDING" } }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.aggregate({ where: { status: "PAID", paidAt: { gte: since } }, _sum: { totalVnd: true } }),
    prisma.order.aggregate({ where: { status: "PAID", paidAt: { gte: todayStart } }, _sum: { totalVnd: true } }),
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
  for (const o of channelOrders) {
    const channel = o.utmSource ? `${o.utmSource}${o.utmMedium ? ` / ${o.utmMedium}` : ""}` : "Trực tiếp / không rõ nguồn";
    revenueByChannel.set(channel, (revenueByChannel.get(channel) ?? 0) + o.totalVnd);
  }
  const channelRows = [...revenueByChannel.entries()].sort((a, b) => b[1] - a[1]);

  return (
    <>
      <div className="admin-topbar">
        <h1>Tổng quan</h1>
        <span style={{ fontSize: ".82rem", color: "var(--a-ink-soft)" }}>
          {new Intl.DateTimeFormat("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date())}
        </span>
      </div>

      <div className="admin-stats">
        <div className="admin-stat">
          <div>
            <b>{formatVnd(revenue30d._sum.totalVnd ?? 0)}</b>
            <span>Doanh thu 30 ngày (đã xác nhận)</span>
          </div>
          <span className="admin-stat-icon">
            <IconTrendingUp />
          </span>
        </div>
        <a className="admin-stat" href="/admin/orders">
          <div>
            <b>{pendingOrderCount}</b>
            <span>Đơn chờ xác nhận thanh toán</span>
          </div>
          <span className="admin-stat-icon gold">
            <IconClock />
          </span>
        </a>
        <a className="admin-stat" href="/admin/leads">
          <div>
            <b>{newLeadCount}</b>
            <span>Liên hệ / báo giá mới</span>
          </div>
          <span className="admin-stat-icon sage">
            <IconMessage />
          </span>
        </a>
        <a className="admin-stat" href="/admin/reviews">
          <div>
            <b>{pendingReviewCount}</b>
            <span>Đánh giá chờ duyệt</span>
          </div>
          <span className="admin-stat-icon gold">
            <IconStar />
          </span>
        </a>
      </div>

      <div className="admin-stats" style={{ marginBottom: 20 }}>
        <div className="admin-stat">
          <div>
            <b>{formatVnd(revenueToday._sum.totalVnd ?? 0)}</b>
            <span>Doanh thu hôm nay</span>
          </div>
          <span className="admin-stat-icon">
            <IconCart />
          </span>
        </div>
        <a className="admin-stat" href="/admin/products">
          <div>
            <b>{productCount}</b>
            <span>Sản phẩm</span>
          </div>
          <span className="admin-stat-icon sage">
            <IconBox />
          </span>
        </a>
        <a className="admin-stat" href="/admin/orders">
          <div>
            <b>{orderCount}</b>
            <span>Tổng đơn hàng</span>
          </div>
          <span className="admin-stat-icon">
            <IconCart />
          </span>
        </a>
        <a className="admin-stat" href="/admin/posts">
          <div>
            <b>{postCount}</b>
            <span>Bài viết</span>
          </div>
          <span className="admin-stat-icon sage">
            <IconFileText />
          </span>
        </a>
      </div>

      {activeLowStock.length > 0 && (
        <div className="admin-panel admin-alert-panel danger" style={{ marginBottom: 20 }}>
          <span className="admin-alert-icon">
            <IconAlert size={20} />
          </span>
          <div style={{ flex: 1 }}>
            <h3 style={{ marginTop: 0, marginBottom: 12 }}>Sắp hết hàng / hết hàng ({activeLowStock.length})</h3>
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
