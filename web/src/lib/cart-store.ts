"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  sizeId: string;
  productSlug: string;
  productName: string;
  productCode: string;
  thumbUrl: string | null;
  sizeLabel: string | null;
  glazeLabel: string | null;
  unitPriceVnd: number;
  qty: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty">, qty: number) => void;
  removeItem: (sizeId: string) => void;
  setQty: (sizeId: string, qty: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item, qty) => {
        const existing = get().items.find((i) => i.sizeId === item.sizeId);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.sizeId === item.sizeId ? { ...i, qty: i.qty + qty } : i,
            ),
          });
        } else {
          set({ items: [...get().items, { ...item, qty }] });
        }
      },
      removeItem: (sizeId) => set({ items: get().items.filter((i) => i.sizeId !== sizeId) }),
      setQty: (sizeId, qty) =>
        set({
          items: get().items.map((i) => (i.sizeId === sizeId ? { ...i, qty: Math.max(1, qty) } : i)),
        }),
      clear: () => set({ items: [] }),
    }),
    { name: "gomsu-cart" },
  ),
);

export function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.unitPriceVnd * i.qty, 0);
}
