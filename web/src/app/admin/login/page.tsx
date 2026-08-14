import { LoginForm } from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="admin">
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <link rel="stylesheet" href="/assets/css/admin.css" />
      <div className="login-wrap">
        <div className="login-card">
          <span className="brand-mark">TM</span>
          <h1>Đăng nhập quản trị</h1>
          <p>Gốm Sứ Trung Mừng — CMS</p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
