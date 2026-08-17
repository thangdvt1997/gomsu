"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";
import { formatVnd, sizeVariantLabel } from "@/lib/format";
import { submitLeadAction } from "@/lib/actions/submit-lead";
import { localeHref, type Locale } from "@/lib/i18n";

type Size = {
  id: string;
  label: string | null;
  heightCm: unknown;
  mouthCm: unknown;
  priceVnd: number | null;
  stockQty: number | null;
};
type Glaze = { key: string; label: string; hex: string };

export function AddToCartControls({
  productId,
  productSlug,
  productName,
  productCode,
  thumbUrl,
  sizes,
  colors,
  locale = "vi",
}: {
  productId: string;
  productSlug: string;
  productName: string;
  productCode: string;
  thumbUrl: string | null;
  sizes: Size[];
  colors: Glaze[];
  locale?: Locale;
}) {
  const isEn = locale === "en";
  const priced = sizes.filter((s) => s.priceVnd !== null);
  const firstInStock = priced.find((s) => s.stockQty !== 0);
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>((firstInStock ?? priced[0])?.id ?? null);
  const [selectedGlaze, setSelectedGlaze] = useState<string | null>(colors[0]?.label ?? null);
  const [qty, setQty] = useState(50);
  const [added, setAdded] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  const selectedSize = sizes.find((s) => s.id === selectedSizeId);
  const maxQty = selectedSize?.stockQty ?? 999;

  function handleAddToCart() {
    if (!selectedSize || selectedSize.priceVnd === null || selectedSize.stockQty === 0) return;
    addItem(
      {
        productId,
        sizeId: selectedSize.id,
        productSlug,
        productName,
        productCode,
        thumbUrl,
        sizeLabel: selectedSize.label,
        glazeLabel: selectedGlaze,
        unitPriceVnd: selectedSize.priceVnd,
      },
      qty,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  return (
    <>
      {priced.length > 0 && (
        <>
          <div className="variant-group">
            <h4>{isEn ? "Size" : "Kích thước"}</h4>
            <div className="variant-options">
              {sizes.map((s) => {
                const isLienHe = s.priceVnd === null;
                const outOfStock = s.stockQty === 0;
                const lowStock = s.stockQty !== null && s.stockQty > 0 && s.stockQty <= 5;
                const disabled = isLienHe || outOfStock;
                return (
                  <button
                    key={s.id}
                    type="button"
                    className={`variant-pill${selectedSizeId === s.id ? " is-active" : ""}`}
                    onClick={() => !disabled && setSelectedSizeId(s.id)}
                    disabled={disabled}
                    style={disabled ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
                    title={isLienHe ? (isEn ? "Contact us for pricing" : "Liên hệ để biết giá") : outOfStock ? (isEn ? "Sold out" : "Tạm hết hàng") : undefined}
                  >
                    {sizeVariantLabel(s, sizes.length === 1, locale)}
                    {isLienHe && (isEn ? " (Contact us)" : " (Liên hệ)")}
                    {outOfStock && (isEn ? " (Sold out)" : " (Hết hàng)")}
                    {!outOfStock && lowStock && (isEn ? ` (Only ${s.stockQty} left)` : ` (Chỉ còn ${s.stockQty})`)}
                  </button>
                );
              })}
            </div>
          </div>
          {colors.length > 0 && (
            <div className="variant-group">
              <h4>{isEn ? "Available glaze colors" : "Tông men có sẵn"}</h4>
              <div className="color-options">
                {colors.map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    className={`color-pill${selectedGlaze === c.label ? " is-active" : ""}`}
                    onClick={() => setSelectedGlaze(c.label)}
                  >
                    <span className="color-dot" style={{ background: c.hex }} />
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="qty-row">
            <div className="qty-stepper">
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label={isEn ? "Decrease quantity" : "Giảm số lượng"}>
                −
              </button>
              <input
                type="text"
                value={qty}
                inputMode="numeric"
                onChange={(e) => setQty(Math.max(1, Math.min(maxQty, parseInt(e.target.value, 10) || 1)))}
                aria-label={isEn ? "Quantity" : "Số lượng đặt"}
              />
              <button type="button" onClick={() => setQty((q) => Math.min(maxQty, q + 1))} aria-label={isEn ? "Increase quantity" : "Tăng số lượng"}>
                +
              </button>
            </div>
            <span style={{ fontSize: ".82rem", color: "var(--ink-faint)" }}>
              {isEn ? "Suggested minimum quantity for wholesale orders" : "Số lượng tối thiểu tham khảo cho đơn sỉ"}
            </span>
          </div>

          <div className="pd-cta">
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleAddToCart}
              disabled={!selectedSize || selectedSize.stockQty === 0}
            >
              {added
                ? isEn ? "Added to cart ✓" : "Đã thêm vào giỏ ✓"
                : selectedSize?.stockQty === 0
                  ? isEn ? "Sold out" : "Tạm hết hàng"
                  : `${isEn ? "Add to Cart" : "Thêm vào giỏ"} — ${selectedSize ? formatVnd(selectedSize.priceVnd!) : ""}`}
            </button>
            <button className="btn btn-outline" type="button" onClick={() => router.push(localeHref("/gio-hang", locale))}>
              {isEn ? "View Cart" : "Xem giỏ hàng"}
            </button>
          </div>
        </>
      )}

      {sizes.some((s) => s.priceVnd === null) && (
        <div style={{ marginTop: priced.length ? 20 : 0 }}>
          {!quoteOpen ? (
            <button className="btn btn-outline btn-block" type="button" onClick={() => setQuoteOpen(true)}>
              {isEn
                ? priced.length
                  ? "Request a Quote for Contact-us Sizes"
                  : "Request a Quote for This Product"
                : priced.length
                  ? "Yêu cầu báo giá cho size Liên hệ"
                  : "Yêu cầu báo giá sản phẩm này"}
            </button>
          ) : (
            <QuoteForm
              productId={productId}
              pending={pending}
              locale={locale}
              onSubmit={(formData) =>
                startTransition(() => {
                  void submitLeadAction({ ok: false }, formData);
                })
              }
              onDone={() => setQuoteOpen(false)}
            />
          )}
        </div>
      )}
    </>
  );
}

function QuoteForm({
  productId,
  onSubmit,
  onDone,
  pending,
  locale,
}: {
  productId: string;
  onSubmit: (formData: FormData) => void;
  onDone: () => void;
  pending: boolean;
  locale: Locale;
}) {
  const isEn = locale === "en";
  const [sent, setSent] = useState(false);
  if (sent) {
    return (
      <p style={{ color: "var(--sage-dark)", fontWeight: 600 }}>
        {isEn ? "Request sent — we'll be in touch shortly!" : "Đã gửi yêu cầu — xưởng sẽ liên hệ sớm nhất!"}
      </p>
    );
  }
  return (
    <form
      action={(fd) => {
        fd.set("productId", productId);
        onSubmit(fd);
        setSent(true);
        setTimeout(onDone, 2000);
      }}
      style={{ display: "grid", gap: 10, marginTop: 10 }}
    >
      <input type="text" name="name" required placeholder={isEn ? "Full name" : "Họ và tên"} />
      <input type="tel" name="phone" required placeholder={isEn ? "Phone number" : "Số điện thoại"} />
      <textarea name="note" placeholder={isEn ? "Note (size, quantity...)" : "Ghi chú (size, số lượng...)"} rows={2} />
      <button className="btn btn-primary" type="submit" disabled={pending}>
        {pending ? (isEn ? "Sending..." : "Đang gửi...") : isEn ? "Send Request" : "Gửi yêu cầu"}
      </button>
    </form>
  );
}
