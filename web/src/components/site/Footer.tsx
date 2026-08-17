import Link from "next/link";
import { COMPANY } from "@/lib/site-config";
import { localeHref, categoryLabel, type Locale } from "@/lib/i18n";

type Category = { slug: string; label: string };

export function Footer({ categories, locale = "vi" }: { categories: Category[]; locale?: Locale }) {
  const isEn = locale === "en";

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="brand" style={{ marginBottom: 16 }}>
              <span className="brand-mark">TM</span>
              <span className="brand-text">
                <b style={{ color: "#fff" }}>{COMPANY.name}</b>
                <span>{isEn ? "Bat Trang Ceramics" : "Gốm sứ Bát Tràng"}</span>
              </span>
            </div>
            <p>
              {isEn
                ? "Workshop producing & wholesaling Bat Trang ceramic vases — over 60 designs, nationwide shipping, custom bulk orders for flower shops, homestays, hotels and restaurants."
                : "Xưởng sản xuất & phân phối sỉ lọ hoa gốm sứ Bát Tràng — hơn 60 mẫu mã, giao hàng toàn quốc, nhận đặt theo yêu cầu số lượng lớn cho shop hoa, homestay, khách sạn, nhà hàng."}
            </p>
            <div className="footer-social">
              <a href={`tel:${COMPANY.phone1Tel}`} aria-label={isEn ? "Call" : "Gọi điện"}>
                ☎
              </a>
              <a href={`https://zalo.me/${COMPANY.zalo}`} aria-label="Zalo">
                Z
              </a>
              <a href={localeHref("/lien-he", locale)} aria-label="Email">
                ✉
              </a>
            </div>
          </div>
          <div>
            <h4>{isEn ? "Categories" : "Danh mục"}</h4>
            <ul>
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`${localeHref("/san-pham", locale)}?cat=${c.slug}`}>
                    {categoryLabel(c.slug, c.label, locale)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>{isEn ? "Company" : "Công ty"}</h4>
            <ul>
              <li>
                <Link href={localeHref("/gioi-thieu", locale)}>{isEn ? "About the Workshop" : "Giới thiệu xưởng gốm"}</Link>
              </li>
              <li>
                <Link href={localeHref("/bao-gia", locale)}>{isEn ? "Wholesale Price List 2026" : "Bảng giá sỉ 2026"}</Link>
              </li>
              <li>
                <Link href={localeHref("/qua-tang-doanh-nghiep", locale)}>{isEn ? "Corporate Gifts" : "Quà tặng doanh nghiệp"}</Link>
              </li>
              <li>
                <Link href={localeHref("/tin-tuc", locale)}>{isEn ? "Blog & Guides" : "Tin tức & cẩm nang"}</Link>
              </li>
              <li>
                <Link href={localeHref("/lien-he", locale)}>{isEn ? "Contact / Order" : "Liên hệ đặt hàng"}</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>{isEn ? "Contact" : "Liên hệ"}</h4>
            <ul>
              <li>{isEn ? COMPANY.addressEn : COMPANY.address}</li>
              <li>
                <a href={`tel:${COMPANY.phone1Tel}`}>{COMPANY.phone1}</a> ·{" "}
                <a href={`tel:${COMPANY.phone2Tel}`}>{COMPANY.phone2}</a>
              </li>
              <li>
                <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © 2026 {COMPANY.name}. {isEn ? "Made in Bat Trang craft village, Gia Lam, Hanoi." : "Sản xuất tại làng nghề Bát Tràng, Gia Lâm, Hà Nội."}
          </span>
          <span>
            <Link href={localeHref("/lien-he", locale)}>{isEn ? "Wholesale Policy" : "Chính sách bán buôn"}</Link> ·{" "}
            <Link href={localeHref("/lien-he", locale)}>{isEn ? "Shipping & Returns" : "Vận chuyển & đổi trả"}</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
