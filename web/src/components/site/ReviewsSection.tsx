"use client";

import { useActionState, useState } from "react";
import { submitReviewAction, type SubmitReviewState } from "@/lib/actions/submit-review";

type ReviewData = {
  id: string;
  customerName: string;
  rating: number;
  title: string | null;
  comment: string;
  createdAt: Date;
};

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(d);
}

const initialState: SubmitReviewState = { ok: false };

export function ReviewsSection({
  productId,
  productSlug,
  reviews,
}: {
  productId: string;
  productSlug: string;
  reviews: ReviewData[];
}) {
  const [state, formAction, pending] = useActionState(submitReviewAction, initialState);
  const [rating, setRating] = useState(5);
  const [showForm, setShowForm] = useState(false);

  return (
    <div style={{ marginTop: 60 }}>
      <div className="section-head" data-reveal style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
        <div>
          <span className="eyebrow">Khách hàng nói gì</span>
          <h2>Đánh Giá Sản Phẩm ({reviews.length})</h2>
        </div>
        {!showForm && !state.ok && (
          <button className="btn btn-outline btn-sm" type="button" onClick={() => setShowForm(true)}>
            Viết đánh giá
          </button>
        )}
      </div>

      {reviews.length === 0 && (
        <p style={{ color: "var(--ink-faint)" }}>Chưa có đánh giá nào — hãy là người đầu tiên chia sẻ trải nghiệm!</p>
      )}

      <div style={{ display: "grid", gap: 18, marginBottom: showForm ? 30 : 0 }}>
        {reviews.map((r) => (
          <div key={r.id} style={{ borderBottom: "1px solid var(--line)", paddingBottom: 18 }}>
            <div className="stars" style={{ fontSize: ".95rem" }}>
              {"★".repeat(r.rating)}
              {"☆".repeat(5 - r.rating)}
            </div>
            {r.title && <h4 style={{ margin: "6px 0 2px" }}>{r.title}</h4>}
            <p style={{ color: "var(--ink-soft)", margin: "4px 0" }}>{r.comment}</p>
            <span style={{ fontSize: ".78rem", color: "var(--ink-faint)" }}>
              {r.customerName} · {formatDate(r.createdAt)}
            </span>
          </div>
        ))}
      </div>

      {state.ok ? (
        <p style={{ color: "var(--sage-dark)", fontWeight: 600 }}>
          Cảm ơn bạn đã đánh giá! Đánh giá sẽ hiển thị công khai sau khi xưởng duyệt.
        </p>
      ) : (
        showForm && (
          <form action={formAction} className="form-grid" style={{ maxWidth: 560 }}>
            <input type="hidden" name="productId" value={productId} />
            <input type="hidden" name="productSlug" value={productSlug} />
            <input type="hidden" name="rating" value={rating} />
            <div className="field full">
              <label>Đánh giá của bạn</label>
              <div style={{ display: "flex", gap: 6 }}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    aria-label={`${n} sao`}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.4rem", color: "var(--gold)", padding: 0 }}
                  >
                    {n <= rating ? "★" : "☆"}
                  </button>
                ))}
              </div>
            </div>
            <div className="field full">
              <label>Họ và tên *</label>
              <input type="text" name="customerName" required placeholder="Nguyễn Văn A" />
            </div>
            <div className="field full">
              <label>Tiêu đề (không bắt buộc)</label>
              <input type="text" name="title" placeholder="VD: Rất ưng ý!" />
            </div>
            <div className="field full">
              <label>Nội dung đánh giá *</label>
              <textarea name="comment" required rows={4} placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..." />
            </div>
            {state.error && (
              <div className="field full">
                <p style={{ color: "var(--terracotta-dark)", fontWeight: 600 }}>{state.error}</p>
              </div>
            )}
            <div className="field full">
              <button className="btn btn-primary" type="submit" disabled={pending}>
                {pending ? "Đang gửi..." : "Gửi đánh giá"}
              </button>
            </div>
          </form>
        )
      )}
    </div>
  );
}
