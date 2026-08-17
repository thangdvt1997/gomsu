"use client";

import Link from "next/link";
import { useCartStore, cartTotal } from "@/lib/cart-store";
import { formatVnd } from "@/lib/format";

export default function EnglishCartPage() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const setQty = useCartStore((s) => s.setQty);

  return (
    <div className="container" style={{ paddingTop: "calc(var(--header-h) + 40px)", paddingBottom: 60 }}>
      <h1>Shopping Cart</h1>
      {items.length === 0 ? (
        <div className="empty-state">
          <p>Your cart is empty.</p>
          <Link className="btn btn-primary" href="/en/san-pham">
            Continue Browsing
          </Link>
        </div>
      ) : (
        <>
          <div className="price-table-wrap">
            <table className="price-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Size / Glaze</th>
                  <th>Unit Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.sizeId}>
                    <td style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {item.thumbUrl && <img src={item.thumbUrl} alt={item.productName} />}
                      <div>
                        <Link className="pname" href={`/en/san-pham/${item.productSlug}`}>
                          {item.productName}
                        </Link>
                        <br />
                        <span style={{ color: "var(--ink-faint)", fontSize: ".78rem" }}>{item.productCode}</span>
                      </div>
                    </td>
                    <td>
                      {item.sizeLabel ?? "—"}
                      {item.glazeLabel && ` · ${item.glazeLabel}`}
                    </td>
                    <td>{formatVnd(item.unitPriceVnd)}</td>
                    <td>
                      <input
                        type="number"
                        min={1}
                        value={item.qty}
                        onChange={(e) => setQty(item.sizeId, parseInt(e.target.value, 10) || 1)}
                        style={{ width: 70, padding: 6 }}
                      />
                    </td>
                    <td className="pprice">{formatVnd(item.unitPriceVnd * item.qty)}</td>
                    <td>
                      <button className="btn btn-sm btn-outline" onClick={() => removeItem(item.sizeId)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24, gap: 24, alignItems: "center" }}>
            <span style={{ fontSize: "1.2rem" }}>
              Total: <b className="pprice">{formatVnd(cartTotal(items))}</b>
            </span>
            <Link className="btn btn-primary" href="/en/thanh-toan">
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
