"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartStore, cartTotal } from "@/lib/cart-store";
import { formatVnd } from "@/lib/format";
import { readStoredUtm } from "@/lib/utm";

type CouponState = { code: string; discountVnd: number } | null;

export default function EnglishCheckoutPage() {
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<CouponState>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);

  const subtotal = cartTotal(items);
  const total = Math.max(0, subtotal - (coupon?.discountVnd ?? 0));

  async function handleApplyCoupon() {
    if (!couponInput.trim()) return;
    setApplying(true);
    setCouponError(null);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput, subtotalVnd: subtotal }),
      });
      const data = await res.json();
      if (!data.valid) {
        setCouponError(data.error ?? "Invalid code.");
        setCoupon(null);
        return;
      }
      setCoupon({ code: couponInput.trim().toUpperCase(), discountVnd: data.discountVnd });
    } catch {
      setCouponError("Could not check the code, please try again.");
    } finally {
      setApplying(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const utm = readStoredUtm();
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
          couponCode: coupon?.code ?? "",
          items: items.map((i) => ({ productId: i.productId, sizeId: i.sizeId, qty: i.qty })),
          ...utm,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong, please try again.");
        setSubmitting(false);
        return;
      }
      clear();
      window.location.href = `/en${data.redirectUrl}`;
    } catch {
      setError("Could not connect to the server, please try again.");
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="container" style={{ paddingTop: "calc(var(--header-h) + 40px)", paddingBottom: 60 }}>
        <h1>Checkout</h1>
        <div className="empty-state">
          <p>Your cart is empty.</p>
          <Link className="btn btn-primary" href="/en/san-pham">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container contact-layout" style={{ paddingTop: "calc(var(--header-h) + 40px)", paddingBottom: 60 }}>
      <div>
        <h1 style={{ fontSize: "1.6rem" }}>Shipping Information</h1>
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="field">
            <label>Full name *</label>
            <input type="text" name="customerName" required />
          </div>
          <div className="field">
            <label>Phone number *</label>
            <input type="tel" name="customerPhone" required />
          </div>
          <div className="field full">
            <label>Email</label>
            <input type="email" name="customerEmail" />
          </div>
          <div className="field full">
            <label>Shipping address *</label>
            <input type="text" name="shippingAddress" required />
          </div>
          <div className="field full">
            <label>Note</label>
            <textarea name="note" />
          </div>
          {error && (
            <div className="field full">
              <p style={{ color: "var(--terracotta-dark)", fontWeight: 600 }}>{error}</p>
            </div>
          )}
          <div className="field full">
            <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>
              {submitting ? "Processing..." : `Get VietQR Transfer Code — ${formatVnd(total)}`}
            </button>
          </div>
        </form>
      </div>
      <div>
        <h2 style={{ fontSize: "1.3rem" }}>Your Order</h2>
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

        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <input
            type="text"
            placeholder="Coupon code"
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
            style={{ flex: 1 }}
          />
          <button className="btn btn-outline btn-sm" type="button" onClick={handleApplyCoupon} disabled={applying}>
            {applying ? "Checking..." : "Apply"}
          </button>
        </div>
        {couponError && <p style={{ color: "var(--terracotta-dark)", fontSize: ".85rem" }}>{couponError}</p>}
        {coupon && (
          <p style={{ color: "var(--sage-dark)", fontSize: ".85rem", fontWeight: 600 }}>
            Applied code {coupon.code} — saved {formatVnd(coupon.discountVnd)}
          </p>
        )}

        <div style={{ marginTop: 16, fontSize: ".95rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Subtotal</span>
            <span>{formatVnd(subtotal)}</span>
          </div>
          {coupon && (
            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--sage-dark)" }}>
              <span>Discount</span>
              <span>-{formatVnd(coupon.discountVnd)}</span>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem", marginTop: 8 }}>
            <span>Total</span>
            <b className="pprice">{formatVnd(total)}</b>
          </div>
        </div>
      </div>
    </div>
  );
}
