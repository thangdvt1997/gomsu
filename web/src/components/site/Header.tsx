import Link from "next/link";
import { COMPANY, NAV_LINKS } from "@/lib/site-config";

export function Header({ active }: { active?: string }) {
  return (
    <header className="site-header">
      <div className="container header-bar">
        <Link className="brand" href="/">
          <span className="brand-mark">TM</span>
          <span className="brand-text">
            <b>{COMPANY.name}</b>
            <span>Gốm sứ Bát Tràng</span>
          </span>
        </Link>
        <nav className="main-nav">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={active === l.href ? "active" : undefined}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <div className="header-phone">
            <small>Hotline đặt sỉ</small>
            <b>{COMPANY.phone1}</b>
          </div>
          <Link className="btn btn-primary btn-sm" href="/lien-he">
            Nhận báo giá
          </Link>
          <button className="nav-toggle" aria-label="Mở menu">
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
}
