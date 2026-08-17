import Script from "next/script";
import { prisma } from "@/lib/db";
import { Header } from "@/components/site/Header";
import { MobileNav } from "@/components/site/MobileNav";
import { Footer } from "@/components/site/Footer";
import { FloatActions, Lightbox } from "@/components/site/FloatActions";
import { UtmCapture } from "@/components/site/UtmCapture";

// Mirrors (site)/layout.tsx exactly, just wired to locale="en" -- see the
// note there on why this whole tree renders dynamically (Category comes
// from Postgres, no DB access at `docker build` time).
export const dynamic = "force-dynamic";

export default async function EnglishSiteLayout({ children }: { children: React.ReactNode }) {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    select: { slug: true, label: true },
  });

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <link rel="stylesheet" href="/assets/css/style.css" />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <UtmCapture />
      <Header locale="en" />
      <MobileNav locale="en" />
      <main id="main">{children}</main>
      <Footer categories={categories} locale="en" />
      <FloatActions />
      <Lightbox />
      <Script src="/assets/js/main.js" strategy="afterInteractive" />
    </>
  );
}
