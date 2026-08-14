"use client";

import { useActionState } from "react";
import { adminLoginAction, type LoginState } from "@/lib/actions/admin-login";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(adminLoginAction, initialState);

  return (
    <form action={formAction} style={{ display: "grid", gap: 16 }}>
      <div className="field">
        <label>Email</label>
        <input type="email" name="email" required autoFocus placeholder="admin@gomceramic.com" />
      </div>
      <div className="field">
        <label>Mật khẩu</label>
        <input type="password" name="password" required />
      </div>
      {state.error && <p style={{ color: "var(--terracotta-dark)", fontWeight: 600 }}>{state.error}</p>}
      <button className="btn btn-primary btn-block" type="submit" disabled={pending}>
        {pending ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>
    </form>
  );
}
