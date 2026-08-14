"use client";

import Link from "next/link";
import { useCartStore, cartTotal } from "@/lib/cart-store";
import { formatVnd } from "@/lib/format";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const setQty = useCartStore((s) => s.setQty);

  return (
    <div className="container" style={{ paddingTop: "calc(var(--header-h) + 40px)", paddingBottom: 60 }}>
      <h1>Giỏ hàng</h1>
      {items.length === 0 ? (
        <div className="empty-state">
          <p>Giỏ hàng của bạn đang trống.</p>
          <Link className="btn btn-primary" href="/san-pham">
            Tiếp tục xem sản phẩm
          </Link>
        </div>
      ) : (
        <>
          <div className="price-table-wrap">
            <table className="price-table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Kích thước / Men</th>
                  <th>Đơn giá</th>
                  <th>Số lượng</th>
                  <th>Thành tiền</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.sizeId}>
                    <td style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {item.thumbUrl && <img src={item.thumbUrl} alt={item.productName} />}
                      <div>
                        <Link className="pname" href={`/san-pham/${item.productSlug}`}>
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
                        Xoá
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24, gap: 24, alignItems: "center" }}>
            <span style={{ fontSize: "1.2rem" }}>
              Tổng cộng: <b className="pprice">{formatVnd(cartTotal(items))}</b>
            </span>
            <Link className="btn btn-primary" href="/thanh-toan">
              Tiến hành thanh toán
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
