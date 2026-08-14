import type { Metadata } from "next";
import { GoogleTagManager } from "@next/third-parties/google";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gomceramic.com";
const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
const analyticsEnabled = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true";
const gscVerification = process.env.NEXT_PUBLIC_GSC_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Gốm Sứ Trung Mừng — Xưởng Lọ Hoa Gốm Sứ Bát Tràng",
    template: "%s | Gốm Sứ Trung Mừng",
  },
  description: "Xưởng sản xuất lọ hoa gốm sứ Bát Tràng — sỉ & lẻ toàn quốc.",
  other: gscVerification ? { "google-site-verification": gscVerification } : undefined,
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Gốm Sứ Trung Mừng",
  url: siteUrl,
  telephone: "+84342869889",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Số 20, Ngõ 263, Thôn 3, Giang Cao",
    addressLocality: "Bát Tràng, Gia Lâm",
    addressRegion: "Hà Nội",
    addressCountry: "VN",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        {children}
        {analyticsEnabled && gtmId ? <GoogleTagManager gtmId={gtmId} /> : null}
      </body>
    </html>
  );
}
