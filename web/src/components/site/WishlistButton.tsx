"use client";

import { useEffect, useState } from "react";
import { useWishlistStore } from "@/lib/wishlist-store";

export function WishlistButton({ productSlug }: { productSlug: string }) {
  const [mounted, setMounted] = useState(false);
  const has = useWishlistStore((s) => s.has(productSlug));
  const toggle = useWishlistStore((s) => s.toggle);

  // Avoid a hydration mismatch: the persisted store only has real data
  // after mounting on the client, so render the "unsaved" state until then.
  useEffect(() => setMounted(true), []);
  const active = mounted && has;

  return (
    <button
      type="button"
      className={`wishlist-btn${active ? " is-active" : ""}`}
      aria-label={active ? "Bỏ khỏi danh sách yêu thích" : "Lưu vào danh sách yêu thích"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(productSlug);
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
      </svg>
    </button>
  );
}
