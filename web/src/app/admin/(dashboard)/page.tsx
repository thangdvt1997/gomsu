import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [productCount, orderCount, newLeadCount, postCount] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.post.count(),
  ]);

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
      <div className="admin-panel">
        <p>Chào mừng đến trang quản trị Gốm Sứ Trung Mừng. Dùng menu bên trái để quản lý sản phẩm, danh mục, tông men, bài viết, đơn hàng và yêu cầu liên hệ.</p>
      </div>
    </>
  );
}
