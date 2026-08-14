import { LoginForm } from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="admin">
      <link rel="stylesheet" href="/assets/css/admin.css" />
      <div className="login-wrap">
        <div className="login-card">
          <h1>Đăng nhập quản trị</h1>
          <p>Gốm Sứ Trung Mừng — CMS</p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
