import Link from "next/link";
import { dimsLabel, minPrice, priceLabel, stockBadge } from "@/lib/format";
import { WishlistButton } from "@/components/site/WishlistButton";

export type ProductCardData = {
  slug: string;
  code: string;
  name: string;
  featured: boolean;
  category: { slug: string; label: string };
  sizes: { label: string | null; heightCm: unknown; mouthCm: unknown; priceVnd: number | null; stockQty: number | null }[];
  colors: { glaze: { key: string; label: string; hex: string } }[];
  images: { url: string; thumbUrl: string | null }[];
};

export function ProductCard({ product, order }: { product: ProductCardData; order: number }) {
  const thumb = product.images[0]?.thumbUrl ?? product.images[0]?.url ?? "/assets/img/placeholder.svg";
  const colorKeys = product.colors.map((c) => c.glaze.key).join(",");
  const stock = stockBadge(product.sizes);

  return (
    <article
      className="product-card"
      data-name={product.name}
      data-code={product.code}
      data-cat={product.category.slug}
      data-colors={colorKeys}
      data-price={minPrice(product.sizes)}
      data-order={order}
    >
      <Link className="thumb" href={`/san-pham/${product.slug}`} style={{ display: "block" }}>
        <img
          src={thumb}
          alt={`${product.name} - Gốm Sứ Trung Mừng Bát Tràng`}
          loading="lazy"
          width={700}
          height={700}
        />
        <span className="code">{product.code}</span>
        {product.featured && <span className="badge-new">Nổi bật</span>}
        {stock?.type === "out" && <span className="badge-stock out">Hết hàng</span>}
        {stock?.type === "low" && <span className="badge-stock low">Chỉ còn {stock.qty}</span>}
        <WishlistButton productSlug={product.slug} />
      </Link>
      <div className="body">
        <span className="cat">{product.category.label}</span>
        <h3>
          <Link href={`/san-pham/${product.slug}`}>{product.name}</Link>
        </h3>
        <div className="dims">{dimsLabel(product.sizes)}</div>
        <div className="price-row">
          <span className="price">{priceLabel(product.sizes)}</span>
          <div className="swatches">
            {product.colors.map((c) => (
              <span
                key={c.glaze.key}
                className="sw"
                style={{ background: c.glaze.hex }}
                title={c.glaze.label}
              />
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
