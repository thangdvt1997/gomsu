import { toCsvRow, parseCsv } from "@/lib/csv";

const CSV_HEADER = [
  "code",
  "name",
  "categorySlug",
  "tag",
  "description",
  "featured",
  "isDraft",
  "metaTitle",
  "metaDescription",
  "sizes",
  "colors",
];

type ProductForExport = {
  code: string;
  name: string;
  category: { slug: string };
  tag: string | null;
  description: string;
  featured: boolean;
  isDraft: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  sizes: { label: string | null; heightCm: unknown; mouthCm: unknown; priceVnd: number | null; stockQty: number | null }[];
  colors: { glaze: { key: string } }[];
};

function n(v: unknown): string {
  if (v === null || v === undefined) return "";
  const num = typeof v === "object" && v !== null && "toNumber" in v ? (v as { toNumber: () => number }).toNumber() : Number(v);
  return Number.isFinite(num) ? String(num) : "";
}

// Sizes/colors packed into one cell each: "label:height:mouth:price:stock"
// rows separated by ";", colors as a plain comma-list of glaze keys. This
// is a controlled internal round-trip format (admin-authored data only,
// not third-party input), not a general CSV-in-CSV solution.
export function encodeSizes(sizes: ProductForExport["sizes"]): string {
  return sizes
    .map((s) => [s.label ?? "", n(s.heightCm), n(s.mouthCm), s.priceVnd ?? "", s.stockQty ?? ""].join(":"))
    .join(";");
}

export function encodeColors(colors: ProductForExport["colors"]): string {
  return colors.map((c) => c.glaze.key).join(",");
}

export function productsToCsv(products: ProductForExport[]): string {
  const lines = [toCsvRow(CSV_HEADER)];
  for (const p of products) {
    lines.push(
      toCsvRow([
        p.code,
        p.name,
        p.category.slug,
        p.tag ?? "",
        p.description,
        p.featured ? "true" : "false",
        p.isDraft ? "true" : "false",
        p.metaTitle ?? "",
        p.metaDescription ?? "",
        encodeSizes(p.sizes),
        encodeColors(p.colors),
      ]),
    );
  }
  return lines.join("\r\n");
}

export type ParsedSize = {
  label: string | null;
  heightCm: number | null;
  mouthCm: number | null;
  priceVnd: number | null;
  stockQty: number | null;
};

export type ParsedProductRow = {
  code: string;
  name: string;
  categorySlug: string;
  tag: string | null;
  description: string;
  featured: boolean;
  isDraft: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  sizes: ParsedSize[];
  colorKeys: string[];
};

function numOrNull(s: string): number | null {
  const trimmed = s.trim();
  if (!trimmed) return null;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : null;
}

export function decodeSizes(raw: string): ParsedSize[] {
  if (!raw.trim()) return [];
  return raw
    .split(";")
    .filter((s) => s.trim())
    .map((chunk) => {
      const [label, height, mouth, price, stock] = chunk.split(":");
      return {
        label: label?.trim() || null,
        heightCm: numOrNull(height ?? ""),
        mouthCm: numOrNull(mouth ?? ""),
        priceVnd: numOrNull(price ?? ""),
        stockQty: numOrNull(stock ?? ""),
      };
    });
}

export function parseProductsCsv(text: string): ParsedProductRow[] {
  const rows = parseCsv(text);
  if (rows.length === 0) return [];
  const [header, ...body] = rows;
  const idx = (col: string) => header.indexOf(col);

  return body.map((row) => ({
    code: row[idx("code")]?.trim() ?? "",
    name: row[idx("name")]?.trim() ?? "",
    categorySlug: row[idx("categorySlug")]?.trim() ?? "",
    tag: row[idx("tag")]?.trim() || null,
    description: row[idx("description")] ?? "",
    featured: row[idx("featured")]?.trim().toLowerCase() === "true",
    isDraft: row[idx("isDraft")]?.trim().toLowerCase() === "true",
    metaTitle: row[idx("metaTitle")]?.trim() || null,
    metaDescription: row[idx("metaDescription")]?.trim() || null,
    sizes: decodeSizes(row[idx("sizes")] ?? ""),
    colorKeys: (row[idx("colors")] ?? "")
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean),
  }));
}
