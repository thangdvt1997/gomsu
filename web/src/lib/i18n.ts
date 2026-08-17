export type Locale = "vi" | "en";

/** Falls back to the Vietnamese value when no (non-empty) English translation exists yet. */
export function pick(vi: string, en: string | null | undefined, locale: Locale): string {
  if (locale === "en" && en && en.trim()) return en;
  return vi;
}

/** Prefixes internal links with /en when on the English site; Vietnamese stays unprefixed (default locale). */
export function localeHref(path: string, locale: Locale): string {
  if (locale !== "en") return path;
  return path === "/" ? "/en" : `/en${path}`;
}

// Category/Glaze are small, rarely-changing fixed taxonomies (not
// admin-editable per-row translations like Product/Post) -- a static map is
// simpler than another schema migration + CMS field for 6-13 short labels.
const CATEGORY_LABELS_EN: Record<string, string> = {
  "mini-de-ban": "Mini & Tabletop",
  "co-dien-men-loang": "Classic & Drip Glaze",
  "dang-doc-la": "Unique Shapes",
  "vua-va-lon": "Medium & Large",
  "bo-suu-tap": "Curated Sets",
  "cao-cap-trang-tri": "Premium Décor",
};

export function categoryLabel(slug: string, viLabel: string, locale: Locale): string {
  return locale === "en" ? (CATEGORY_LABELS_EN[slug] ?? viLabel) : viLabel;
}

const GLAZE_LABELS_EN: Record<string, string> = {
  trang: "Cool White",
  tieu: "Speckled Ash",
  hong: "Powder Pink",
  "xanh-la": "Leaf Green",
  "xanh-co-vit": "Duck-neck Teal",
  "soi-trang": "Crackled White",
  "soi-xanh": "Crackled Moss",
  "soi-nau": "Crackled Brown",
  "xi-mang": "Concrete Grey",
  "kho-hong": "Matte Terracotta",
  "kho-xanh-la": "Matte Green",
  "kho-xanh-bien": "Matte Ocean Blue",
  "kho-den": "Matte Black",
};

export function glazeLabel(key: string, viLabel: string, locale: Locale): string {
  return locale === "en" ? (GLAZE_LABELS_EN[key] ?? viLabel) : viLabel;
}
