import Link from "next/link";
import { COMPANY, NAV_LINKS } from "@/lib/site-config";

export function MobileNav() {
  return (
    <div className="mobile-nav">
      <div className="close-row">
        <button className="nav-toggle mn-close" aria-label="Đóng menu">
          <span></span>
        </button>
      </div>
      {NAV_LINKS.map((l) => (
        <Link key={l.href} href={l.href}>
          {l.label}
        </Link>
      ))}
      <div className="mn-contact">
        <a className="btn btn-primary btn-block" href={`tel:${COMPANY.phone1Tel}`}>
          Gọi ngay {COMPANY.phone1}
        </a>
      </div>
    </div>
  );
}
