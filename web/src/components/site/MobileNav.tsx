import Link from "next/link";
import { COMPANY, NAV_LINKS } from "@/lib/site-config";
import { localeHref, type Locale } from "@/lib/i18n";

export function MobileNav({ locale = "vi" }: { locale?: Locale }) {
  return (
    <div className="mobile-nav">
      <div className="close-row">
        <button className="nav-toggle mn-close" aria-label={locale === "en" ? "Close menu" : "Đóng menu"}>
          <span></span>
        </button>
      </div>
      {NAV_LINKS.map((l) => (
        <Link key={l.href} href={localeHref(l.href, locale)}>
          {locale === "en" ? l.labelEn : l.label}
        </Link>
      ))}
      <div className="mn-contact">
        <a className="btn btn-primary btn-block" href={`tel:${COMPANY.phone1Tel}`}>
          {locale === "en" ? `Call ${COMPANY.phone1}` : `Gọi ngay ${COMPANY.phone1}`}
        </a>
      </div>
    </div>
  );
}
