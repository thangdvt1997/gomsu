"use client";

import { useActionState } from "react";
import { submitLeadAction, type SubmitLeadState } from "@/lib/actions/submit-lead";
import { COMPANY } from "@/lib/site-config";

const CATEGORY_OPTIONS = [
  "Chưa xác định — tư vấn giúp tôi",
  "Mini & để bàn",
  "Cổ điển & men loang",
  "Dáng độc lạ",
  "Vừa & lớn",
  "Bộ sưu tập",
  "Cao cấp & trang trí",
];

const initialState: SubmitLeadState = { ok: false };

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitLeadAction, initialState);

  if (state.ok) {
    return (
      <div className="field full" role="status">
        <h3 style={{ marginBottom: 8 }}>Đã gửi yêu cầu thành công!</h3>
        <p style={{ color: "var(--ink-soft)" }}>
          Xưởng sẽ liên hệ lại qua số điện thoại bạn để lại trong vòng 30 phút làm việc. Để được
          phản hồi nhanh nhất, bạn cũng có thể nhắn trực tiếp qua{" "}
          <a
            href={`https://zalo.me/${COMPANY.zalo}`}
            target="_blank"
            rel="noopener"
            style={{ color: "var(--terracotta-dark)", fontWeight: 700 }}
          >
            Zalo {COMPANY.zalo}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form className="form-grid" action={formAction}>
      <div className="field">
        <label>Họ và tên *</label>
        <input type="text" name="name" required placeholder="Nguyễn Văn A" />
      </div>
      <div className="field">
        <label>Số điện thoại *</label>
        <input type="tel" name="phone" required placeholder="09xxxxxxxx" />
      </div>
      <div className="field full">
        <label>Email</label>
        <input type="email" name="email" placeholder="ban@congty.vn" />
      </div>
      <div className="field full">
        <label>Bạn quan tâm mẫu nào?</label>
        <select name="categoryInterest" defaultValue={CATEGORY_OPTIONS[0]}>
          {CATEGORY_OPTIONS.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>
      <div className="field full">
        <label>Số lượng dự kiến</label>
        <input type="text" name="expectedQty" placeholder="VD: 200 chiếc / tháng" />
      </div>
      <div className="field full">
        <label>Ghi chú</label>
        <textarea name="note" placeholder="Mẫu mã, màu men, thời gian cần giao..." />
      </div>
      {state.error && (
        <div className="field full">
          <p style={{ color: "var(--terracotta-dark)", fontWeight: 600 }}>{state.error}</p>
        </div>
      )}
      <div className="field full">
        <button className="btn btn-primary btn-block" type="submit" disabled={pending}>
          {pending ? "Đang gửi..." : "Gửi yêu cầu báo giá"}
        </button>
        <p style={{ fontSize: ".78rem", color: "var(--ink-faint)", marginTop: 10 }}>
          Để được phản hồi nhanh nhất, vui lòng nhắn trực tiếp qua{" "}
          <a
            href={`https://zalo.me/${COMPANY.zalo}`}
            target="_blank"
            rel="noopener"
            style={{ color: "var(--terracotta-dark)", fontWeight: 700 }}
          >
            Zalo {COMPANY.zalo}
          </a>
          .
        </p>
      </div>
    </form>
  );
}
