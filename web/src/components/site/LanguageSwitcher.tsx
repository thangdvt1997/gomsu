"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname() || "/";
  const bare = pathname.replace(/^\/en(\/|$)/, "/");
  const viHref = bare;
  const enHref = bare === "/" ? "/en" : `/en${bare}`;

  return (
    <div className="lang-switch">
      <Link href={viHref} className={locale === "vi" ? "is-active" : undefined}>
        VI
      </Link>
      <span>/</span>
      <Link href={enHref} className={locale === "en" ? "is-active" : undefined}>
        EN
      </Link>
    </div>
  );
}
