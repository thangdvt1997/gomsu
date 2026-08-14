export function formatVnd(n: number): string {
  return `${n.toLocaleString("vi-VN")}đ`;
}

type SizeLike = { heightCm: unknown; mouthCm: unknown; priceVnd: number | null };

function toNum(v: unknown): number | null {
  if (v === null || v === undefined) return null;
  const n = typeof v === "object" && v !== null && "toNumber" in v
    ? (v as { toNumber: () => number }).toNumber()
    : Number(v);
  return Number.isFinite(n) ? n : null;
}

export function priceLabel(sizes: SizeLike[]): string {
  const prices = sizes.map((s) => s.priceVnd).filter((p): p is number => p !== null);
  if (!prices.length) return "Liên hệ";
  const min = Math.min(...prices);
  return sizes.length > 1 && new Set(prices).size > 1 ? `Từ ${formatVnd(min)}` : formatVnd(min);
}

/** Lowest priced size, used for catalog sort/filter (data-price). 0 when every size is "Lien he". */
export function minPrice(sizes: SizeLike[]): number {
  const prices = sizes.map((s) => s.priceVnd).filter((p): p is number => p !== null);
  return prices.length ? Math.min(...prices) : 0;
}

export function sizeDimsText(s: SizeLike): string | null {
  const h = toNum(s.heightCm);
  const m = toNum(s.mouthCm);
  if (h !== null && m !== null) return `Cao ${h}cm × Miệng ${m}cm`;
  if (h !== null) return `Cao ${h}cm`;
  return null;
}

export function sizeVariantLabel(s: { label: string | null } & SizeLike, isOnly: boolean): string {
  const dims = sizeDimsText(s);
  if (isOnly && !s.label) {
    return dims ? `Kích thước tiêu chuẩn — ${dims}` : "Kích thước tiêu chuẩn";
  }
  const prefix = s.label ?? "";
  if (!dims) return prefix || (s.label ?? "");
  return prefix ? `${prefix} — ${dims}` : dims;
}

export function priceRowParts(s: { label: string | null } & SizeLike): { dims: string; price: string } {
  const h = toNum(s.heightCm);
  const m = toNum(s.mouthCm);
  const dimsParts: string[] = [];
  if (h !== null) dimsParts.push(`C${h}`);
  if (m !== null) dimsParts.push(`M${m}`);
  const dims = dimsParts.length ? dimsParts.join(" / ") : s.label ?? "";
  const prefix = s.label && h !== null ? `${s.label}: ` : "";
  const price = s.priceVnd !== null ? formatVnd(s.priceVnd) : "Liên hệ";
  return { dims: `${prefix}${dims}`, price };
}

const LOW_STOCK_THRESHOLD = 5;

type StockSizeLike = { priceVnd: number | null; stockQty: number | null };

export type StockBadge = { type: "out" | "low"; qty?: number };

/**
 * stockQty is nullable per size on purpose -- null means "not tracked",
 * i.e. always treated as in stock (matches every size before this feature
 * existed). Only sizes that actually have a number set participate here.
 */
export function stockBadge(sizes: StockSizeLike[]): StockBadge | null {
  const tracked = sizes.filter(
    (s): s is StockSizeLike & { stockQty: number } => s.priceVnd !== null && s.stockQty !== null,
  );
  if (!tracked.length) return null;
  const maxQty = Math.max(...tracked.map((s) => s.stockQty));
  if (maxQty <= 0) return { type: "out" };
  if (maxQty <= LOW_STOCK_THRESHOLD) return { type: "low", qty: maxQty };
  return null;
}

export function dimsLabel(sizes: SizeLike[]): string {
  if (!sizes.length) return "";
  const first = sizes[0];
  const h = toNum(first.heightCm);
  const m = toNum(first.mouthCm);
  const parts: string[] = [];
  if (h !== null) parts.push(`Cao ${h}cm`);
  if (m !== null) parts.push(`Miệng ${m}cm`);
  let label = parts.join(" · ");
  if (sizes.length > 1) label += ` · ${sizes.length} kích cỡ`;
  return label;
}
