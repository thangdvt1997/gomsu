"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartStore, cartTotal } from "@/lib/cart-store";
import { formatVnd } from "@/lib/format";

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.get("customerName"),
          customerPhone: form.get("customerPhone"),
          customerEmail: form.get("customerEmail"),
          shippingAddress: form.get("shippingAddress"),
          note: form.get("note"),
          items: items.map((i) => ({ productId: i.productId, sizeId: i.sizeId, qty: i.qty })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Có lỗi xảy ra, vui lòng thử lại.");
        setSubmitting(false);
        return;
      }
      clear();
      window.location.href = data.redirectUrl;
    } catch {
      setError("Không thể kết nối máy chủ, vui lòng thử lại.");
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="container" style={{ paddingTop: "calc(var(--header-h) + 40px)", paddingBottom: 60 }}>
        <h1>Thanh toán</h1>
        <div className="empty-state">
          <p>Giỏ hàng đang trống.</p>
          <Link className="btn btn-primary" href="/san-pham">
            Xem sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container contact-layout" style={{ paddingTop: "calc(var(--header-h) + 40px)", paddingBottom: 60 }}>
      <div>
        <h1 style={{ fontSize: "1.6rem" }}>Thông tin giao hàng</h1>
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="field">
            <label>Họ và tên *</label>
            <input type="text" name="customerName" required />
          </div>
          <div className="field">
            <label>Số điện thoại *</label>
            <input type="tel" name="customerPhone" required />
          </div>
          <div className="field full">
            <label>Email</label>
            <input type="email" name="customerEmail" />
          </div>
          <div className="field full">
            <label>Địa chỉ giao hàng *</label>
            <input type="text" name="shippingAddress" required />
          </div>
          <div className="field full">
            <label>Ghi chú</label>
            <textarea name="note" />
          </div>
          {error && (
            <div className="field full">
              <p style={{ color: "var(--terracotta-dark)", fontWeight: 600 }}>{error}</p>
            </div>
          )}
          <div className="field full">
            <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>
              {submitting ? "Đang xử lý..." : `Lấy mã QR chuyển khoản — ${formatVnd(cartTotal(items))}`}
            </button>
          </div>
        </form>
      </div>
      <div>
        <h2 style={{ fontSize: "1.3rem" }}>Đơn hàng của bạn</h2>
        {items.map((item) => (
          <div key={item.sizeId} className="info-card">
            {item.thumbUrl && <img src={item.thumbUrl} alt="" style={{ width: 46, height: 46, borderRadius: 8, objectFit: "cover" }} />}
            <div>
              <h4>
                {item.productName} {item.sizeLabel && `(${item.sizeLabel})`}
              </h4>
              <p>
                {item.qty} × {formatVnd(item.unitPriceVnd)} = {formatVnd(item.qty * item.unitPriceVnd)}
              </p>
            </div>
          </div>
        ))}
        <div style={{ textAlign: "right", marginTop: 16, fontSize: "1.2rem" }}>
          Tổng cộng: <b className="pprice">{formatVnd(cartTotal(items))}</b>
        </div>
      </div>
    </div>
  );
}
