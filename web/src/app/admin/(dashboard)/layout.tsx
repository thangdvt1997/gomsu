import Link from "next/link";
import { auth, signOut } from "@/lib/auth";

const NAV = [
  { href: "/admin", label: "Tổng quan" },
  { href: "/admin/products", label: "Sản phẩm" },
  { href: "/admin/categories", label: "Danh mục" },
  { href: "/admin/glaze", label: "Tông men" },
  { href: "/admin/posts", label: "Bài viết" },
  { href: "/admin/orders", label: "Đơn hàng" },
  { href: "/admin/leads", label: "Liên hệ / Báo giá" },
];

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="admin">
      <link rel="stylesheet" href="/assets/css/admin.css" />
      <div className="admin-shell">
        <aside className="admin-sidebar">
          <div className="brand">Gốm Sứ Trung Mừng</div>
          {NAV.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          <div className="sep" />
          <div style={{ fontSize: ".8rem", color: "rgba(255,255,255,.6)", padding: "0 12px 8px" }}>
            {session?.user?.email}
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
          >
            <button
              type="submit"
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,.78)",
                padding: "10px 12px",
                cursor: "pointer",
                width: "100%",
                textAlign: "left",
                fontSize: ".92rem",
              }}
            >
              Đăng xuất
            </button>
          </form>
        </aside>
        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}
