import { auth, signOut } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { IconLogout } from "@/components/admin/AdminIcons";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const email = session?.user?.email ?? "";
  const initials = email ? email.slice(0, 2).toUpperCase() : "GS";

  return (
    <div className="admin">
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <link rel="stylesheet" href="/assets/css/admin.css" />
      <div className="admin-shell">
        <aside className="admin-sidebar">
          <div className="brand">
            <span className="brand-mark">TM</span>
            <span className="brand-text">
              <b>Trung Mừng</b>
              <span>Gốm Sứ CMS</span>
            </span>
          </div>

          <AdminNav />

          <div className="admin-sidebar-foot">
            <div className="admin-user">
              <span className="admin-user-avatar">{initials}</span>
              <div className="admin-user-info">
                <b>Quản trị viên</b>
                <span title={email}>{email}</span>
              </div>
            </div>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/admin/login" });
              }}
            >
              <button className="admin-logout-btn" type="submit">
                <IconLogout size={16} />
                Đăng xuất
              </button>
            </form>
          </div>
        </aside>

        <main className="admin-main">
          <div className="admin-header">
            <a href="/" target="_blank" rel="noopener" style={{ fontSize: ".82rem", color: "var(--a-ink-soft)", fontWeight: 600, textDecoration: "none" }}>
              ↗ Xem website
            </a>
          </div>
          <div className="admin-content">{children}</div>
        </main>
      </div>
    </div>
  );
}
