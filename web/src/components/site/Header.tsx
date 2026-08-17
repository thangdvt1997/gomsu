import Link from "next/link";
import { COMPANY, NAV_LINKS } from "@/lib/site-config";
import { localeHref, type Locale } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/site/LanguageSwitcher";

export function Header({ active, locale = "vi" }: { active?: string; locale?: Locale }) {
  return (
    <header className="site-header">
      <div className="container header-bar">
        <Link className="brand" href={localeHref("/", locale)}>
          <span className="brand-mark">TM</span>
          <span className="brand-text">
            <b>{COMPANY.name}</b>
            <span>{locale === "en" ? "Bat Trang Ceramics" : "Gốm sứ Bát Tràng"}</span>
          </span>
        </Link>
        <nav className="main-nav">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={localeHref(l.href, locale)}
              className={active === l.href ? "active" : undefined}
            >
              {locale === "en" ? l.labelEn : l.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <LanguageSwitcher locale={locale} />
          <div className="header-phone">
            <small>{locale === "en" ? "Wholesale hotline" : "Hotline đặt sỉ"}</small>
            <b>{COMPANY.phone1}</b>
          </div>
          <Link className="btn btn-primary btn-sm" href={localeHref("/lien-he", locale)}>
            {locale === "en" ? "Get a Quote" : "Nhận báo giá"}
          </Link>
          <button className="nav-toggle" aria-label={locale === "en" ? "Open menu" : "Mở menu"}>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
}
