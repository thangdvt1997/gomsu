"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";
import { formatVnd, sizeVariantLabel } from "@/lib/format";
import { submitLeadAction } from "@/lib/actions/submit-lead";

type Size = {
  id: string;
  label: string | null;
  heightCm: unknown;
  mouthCm: unknown;
  priceVnd: number | null;
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
}: {
  productId: string;
  productSlug: string;
  productName: string;
  productCode: string;
  thumbUrl: string | null;
  sizes: Size[];
  colors: Glaze[];
}) {
  const priced = sizes.filter((s) => s.priceVnd !== null);
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(priced[0]?.id ?? null);
  const [selectedGlaze, setSelectedGlaze] = useState<string | null>(colors[0]?.label ?? null);
  const [qty, setQty] = useState(50);
  const [added, setAdded] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  const selectedSize = sizes.find((s) => s.id === selectedSizeId);

  function handleAddToCart() {
    if (!selectedSize || selectedSize.priceVnd === null) return;
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
            <h4>Kích thước</h4>
            <div className="variant-options">
              {sizes.map((s) => {
                const isLienHe = s.priceVnd === null;
                return (
                  <button
                    key={s.id}
                    type="button"
                    className={`variant-pill${selectedSizeId === s.id ? " is-active" : ""}`}
                    onClick={() => !isLienHe && setSelectedSizeId(s.id)}
                    disabled={isLienHe}
                    style={isLienHe ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
                    title={isLienHe ? "Liên hệ để biết giá" : undefined}
                  >
                    {sizeVariantLabel(s, sizes.length === 1)}
                    {isLienHe && " (Liên hệ)"}
                  </button>
                );
              })}
            </div>
          </div>
          {colors.length > 0 && (
            <div className="variant-group">
              <h4>Tông men có sẵn</h4>
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
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Giảm số lượng">
                −
              </button>
              <input
                type="text"
                value={qty}
                inputMode="numeric"
                onChange={(e) => setQty(Math.max(1, Math.min(999, parseInt(e.target.value, 10) || 1)))}
                aria-label="Số lượng đặt"
              />
              <button type="button" onClick={() => setQty((q) => Math.min(999, q + 1))} aria-label="Tăng số lượng">
                +
              </button>
            </div>
            <span style={{ fontSize: ".82rem", color: "var(--ink-faint)" }}>
              Số lượng tối thiểu tham khảo cho đơn sỉ
            </span>
          </div>

          <div className="pd-cta">
            <button className="btn btn-primary" type="button" onClick={handleAddToCart} disabled={!selectedSize}>
              {added ? "Đã thêm vào giỏ ✓" : `Thêm vào giỏ — ${selectedSize ? formatVnd(selectedSize.priceVnd!) : ""}`}
            </button>
            <button className="btn btn-outline" type="button" onClick={() => router.push("/gio-hang")}>
              Xem giỏ hàng
            </button>
          </div>
        </>
      )}

      {sizes.some((s) => s.priceVnd === null) && (
        <div style={{ marginTop: priced.length ? 20 : 0 }}>
          {!quoteOpen ? (
            <button className="btn btn-outline btn-block" type="button" onClick={() => setQuoteOpen(true)}>
              {priced.length ? "Yêu cầu báo giá cho size Liên hệ" : "Yêu cầu báo giá sản phẩm này"}
            </button>
          ) : (
            <QuoteForm
              productId={productId}
              pending={pending}
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
}: {
  productId: string;
  onSubmit: (formData: FormData) => void;
  onDone: () => void;
  pending: boolean;
}) {
  const [sent, setSent] = useState(false);
  if (sent) {
    return <p style={{ color: "var(--sage-dark)", fontWeight: 600 }}>Đã gửi yêu cầu — xưởng sẽ liên hệ sớm nhất!</p>;
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
      <input type="text" name="name" required placeholder="Họ và tên" />
      <input type="tel" name="phone" required placeholder="Số điện thoại" />
      <textarea name="note" placeholder="Ghi chú (size, số lượng...)" rows={2} />
      <button className="btn btn-primary" type="submit" disabled={pending}>
        {pending ? "Đang gửi..." : "Gửi yêu cầu"}
      </button>
    </form>
  );
}
