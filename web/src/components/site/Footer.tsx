import Link from "next/link";
import { COMPANY } from "@/lib/site-config";

type Category = { slug: string; label: string };

export function Footer({ categories }: { categories: Category[] }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="brand" style={{ marginBottom: 16 }}>
              <span className="brand-mark">TM</span>
              <span className="brand-text">
                <b style={{ color: "#fff" }}>{COMPANY.name}</b>
                <span>Gốm sứ Bát Tràng</span>
              </span>
            </div>
            <p>
              Xưởng sản xuất &amp; phân phối sỉ lọ hoa gốm sứ Bát Tràng — hơn 60 mẫu mã, giao hàng
              toàn quốc, nhận đặt theo yêu cầu số lượng lớn cho shop hoa, homestay, khách sạn, nhà
              hàng.
            </p>
            <div className="footer-social">
              <a href={`tel:${COMPANY.phone1Tel}`} aria-label="Gọi điện">
                ☎
              </a>
              <a href={`https://zalo.me/${COMPANY.zalo}`} aria-label="Zalo">
                Z
              </a>
              <a href="/lien-he" aria-label="Email">
                ✉
              </a>
            </div>
          </div>
          <div>
            <h4>Danh mục</h4>
            <ul>
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/san-pham?cat=${c.slug}`}>{c.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Công ty</h4>
            <ul>
              <li>
                <Link href="/gioi-thieu">Giới thiệu xưởng gốm</Link>
              </li>
              <li>
                <Link href="/bao-gia">Bảng giá sỉ 2026</Link>
              </li>
              <li>
                <Link href="/qua-tang-doanh-nghiep">Quà tặng doanh nghiệp</Link>
              </li>
              <li>
                <Link href="/tin-tuc">Tin tức &amp; cẩm nang</Link>
              </li>
              <li>
                <Link href="/lien-he">Liên hệ đặt hàng</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Liên hệ</h4>
            <ul>
              <li>{COMPANY.address}</li>
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
          <span>© 2026 {COMPANY.name}. Sản xuất tại làng nghề Bát Tràng, Gia Lâm, Hà Nội.</span>
          <span>
            <Link href="/lien-he">Chính sách bán buôn</Link> ·{" "}
            <Link href="/lien-he">Vận chuyển &amp; đổi trả</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
