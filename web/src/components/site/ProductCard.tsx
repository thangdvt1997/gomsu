import Link from "next/link";
import { dimsLabel, minPrice, priceLabel, stockBadge } from "@/lib/format";
import { WishlistButton } from "@/components/site/WishlistButton";
import { pick, localeHref, categoryLabel, type Locale } from "@/lib/i18n";

export type ProductCardData = {
  slug: string;
  code: string;
  name: string;
  nameEn?: string | null;
  featured: boolean;
  category: { slug: string; label: string };
  sizes: { label: string | null; heightCm: unknown; mouthCm: unknown; priceVnd: number | null; stockQty: number | null }[];
  colors: { glaze: { key: string; label: string; hex: string } }[];
  images: { url: string; thumbUrl: string | null }[];
};

export function ProductCard({
  product,
  order,
  locale = "vi",
}: {
  product: ProductCardData;
  order: number;
  locale?: Locale;
}) {
  const thumb = product.images[0]?.thumbUrl ?? product.images[0]?.url ?? "/assets/img/placeholder.svg";
  const colorKeys = product.colors.map((c) => c.glaze.key).join(",");
  const stock = stockBadge(product.sizes);
  const name = pick(product.name, product.nameEn, locale);
  const href = localeHref(`/san-pham/${product.slug}`, locale);

  return (
    <article
      className="product-card"
      data-name={name}
      data-code={product.code}
      data-cat={product.category.slug}
      data-colors={colorKeys}
      data-price={minPrice(product.sizes)}
      data-order={order}
    >
      <Link className="thumb" href={href} style={{ display: "block" }}>
        <img src={thumb} alt={`${name} - Gốm Sứ Trung Mừng Bát Tràng`} loading="lazy" width={700} height={700} />
        <span className="code">{product.code}</span>
        {product.featured && <span className="badge-new">{locale === "en" ? "Featured" : "Nổi bật"}</span>}
        {stock?.type === "out" && <span className="badge-stock out">{locale === "en" ? "Sold out" : "Hết hàng"}</span>}
        {stock?.type === "low" && (
          <span className="badge-stock low">{locale === "en" ? `Only ${stock.qty} left` : `Chỉ còn ${stock.qty}`}</span>
        )}
        <WishlistButton productSlug={product.slug} />
      </Link>
      <div className="body">
        <span className="cat">{categoryLabel(product.category.slug, product.category.label, locale)}</span>
        <h3>
          <Link href={href}>{name}</Link>
        </h3>
        <div className="dims">{dimsLabel(product.sizes, locale)}</div>
        <div className="price-row">
          <span className="price">{priceLabel(product.sizes, locale)}</span>
          <div className="swatches">
            {product.colors.map((c) => (
              <span key={c.glaze.key} className="sw" style={{ background: c.glaze.hex }} title={c.glaze.label} />
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
