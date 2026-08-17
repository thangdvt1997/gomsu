"use client";

import { useActionState } from "react";
import { submitLeadAction, type SubmitLeadState } from "@/lib/actions/submit-lead";
import { COMPANY } from "@/lib/site-config";
import type { Locale } from "@/lib/i18n";

const CATEGORY_OPTIONS = [
  "Chưa xác định — tư vấn giúp tôi",
  "Mini & để bàn",
  "Cổ điển & men loang",
  "Dáng độc lạ",
  "Vừa & lớn",
  "Bộ sưu tập",
  "Cao cấp & trang trí",
];

const CATEGORY_OPTIONS_EN = [
  "Not sure yet — please advise",
  "Mini & tabletop",
  "Classic & drip glaze",
  "Unique shapes",
  "Medium & large",
  "Curated sets",
  "Premium décor",
];

const initialState: SubmitLeadState = { ok: false };

export function ContactForm({ locale = "vi" }: { locale?: Locale }) {
  const isEn = locale === "en";
  const options = isEn ? CATEGORY_OPTIONS_EN : CATEGORY_OPTIONS;
  const [state, formAction, pending] = useActionState(submitLeadAction, initialState);

  if (state.ok) {
    return (
      <div className="field full" role="status">
        <h3 style={{ marginBottom: 8 }}>{isEn ? "Request sent successfully!" : "Đã gửi yêu cầu thành công!"}</h3>
        <p style={{ color: "var(--ink-soft)" }}>
          {isEn ? (
            <>
              We&apos;ll contact you at the phone number provided within 30 business minutes. For the
              fastest response, you can also message us directly on{" "}
              <a
                href={`https://zalo.me/${COMPANY.zalo}`}
                target="_blank"
                rel="noopener"
                style={{ color: "var(--terracotta-dark)", fontWeight: 700 }}
              >
                Zalo {COMPANY.zalo}
              </a>
              .
            </>
          ) : (
            <>
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
            </>
          )}
        </p>
      </div>
    );
  }

  return (
    <form className="form-grid" action={formAction}>
      <div className="field">
        <label>{isEn ? "Full name *" : "Họ và tên *"}</label>
        <input type="text" name="name" required placeholder={isEn ? "Jane Smith" : "Nguyễn Văn A"} />
      </div>
      <div className="field">
        <label>{isEn ? "Phone number *" : "Số điện thoại *"}</label>
        <input type="tel" name="phone" required placeholder={isEn ? "+84 9xxxxxxxx" : "09xxxxxxxx"} />
      </div>
      <div className="field full">
        <label>Email</label>
        <input type="email" name="email" placeholder={isEn ? "you@company.com" : "ban@congty.vn"} />
      </div>
      <div className="field full">
        <label>{isEn ? "Which design are you interested in?" : "Bạn quan tâm mẫu nào?"}</label>
        <select name="categoryInterest" defaultValue={options[0]}>
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>
      <div className="field full">
        <label>{isEn ? "Expected quantity" : "Số lượng dự kiến"}</label>
        <input type="text" name="expectedQty" placeholder={isEn ? "E.g. 200 units / month" : "VD: 200 chiếc / tháng"} />
      </div>
      <div className="field full">
        <label>{isEn ? "Note" : "Ghi chú"}</label>
        <textarea name="note" placeholder={isEn ? "Designs, glaze colors, delivery timing..." : "Mẫu mã, màu men, thời gian cần giao..."} />
      </div>
      {state.error && (
        <div className="field full">
          <p style={{ color: "var(--terracotta-dark)", fontWeight: 600 }}>{state.error}</p>
        </div>
      )}
      <div className="field full">
        <button className="btn btn-primary btn-block" type="submit" disabled={pending}>
          {pending ? (isEn ? "Sending..." : "Đang gửi...") : isEn ? "Send Quote Request" : "Gửi yêu cầu báo giá"}
        </button>
        <p style={{ fontSize: ".78rem", color: "var(--ink-faint)", marginTop: 10 }}>
          {isEn ? (
            <>
              For the fastest response, please message us directly on{" "}
              <a
                href={`https://zalo.me/${COMPANY.zalo}`}
                target="_blank"
                rel="noopener"
                style={{ color: "var(--terracotta-dark)", fontWeight: 700 }}
              >
                Zalo {COMPANY.zalo}
              </a>
              .
            </>
          ) : (
            <>
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
            </>
          )}
        </p>
      </div>
    </form>
  );
}
