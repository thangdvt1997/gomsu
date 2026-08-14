import type { Metadata } from "next";
import { GoogleTagManager } from "@next/third-parties/google";
import { JsonLd } from "@/components/JsonLd";
import { getSettings, SETTING_KEYS } from "@/lib/settings";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gomceramic.com";

// Reads DB-backed settings (editable at /admin/settings), so GA4/GTM ids
// and search-console verification can change without a redeploy -- falls
// back to env vars (see lib/settings.ts) until an admin sets them.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const gscVerification = settings[SETTING_KEYS.GSC_VERIFICATION];
  const bingVerification = settings[SETTING_KEYS.BING_VERIFICATION];
  const other: Record<string, string> = {};
  if (gscVerification) other["google-site-verification"] = gscVerification;
  if (bingVerification) other["msvalidate.01"] = bingVerification;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: "Gốm Sứ Trung Mừng — Xưởng Lọ Hoa Gốm Sứ Bát Tràng",
      template: "%s | Gốm Sứ Trung Mừng",
    },
    description: "Xưởng sản xuất lọ hoa gốm sứ Bát Tràng — sỉ & lẻ toàn quốc.",
    other: Object.keys(other).length ? other : undefined,
  };
}

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  const gtmId = settings[SETTING_KEYS.GTM_ID];
  const analyticsEnabled = settings[SETTING_KEYS.ANALYTICS_ENABLED] === "true";

  return (
    <html lang="vi">
      <body>
        <JsonLd data={localBusinessJsonLd} />
        {children}
        {analyticsEnabled && gtmId ? <GoogleTagManager gtmId={gtmId} /> : null}
      </body>
    </html>
  );
}
