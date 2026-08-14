const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gomceramic.com";

export function bingConfigured(): boolean {
  return !!process.env.BING_WEBMASTER_API_KEY;
}

export type BingQueryStat = {
  query: string;
  clicks: number;
  impressions: number;
  avgClickPosition: number | null;
  avgImpressionPosition: number | null;
};

// Bing Webmaster Tools' JSON API (ssl.bing.com/webmaster/api.svc/json) --
// one API key per Bing account (Webmaster Tools -> Settings -> API
// Access), reusable across every site verified under that account.
export async function getBingQueryStats(): Promise<BingQueryStat[]> {
  const apiKey = process.env.BING_WEBMASTER_API_KEY;
  if (!apiKey) return [];

  const params = new URLSearchParams({ apikey: apiKey, siteUrl: SITE_URL });
  const res = await fetch(`https://ssl.bing.com/webmaster/api.svc/json/GetQueryStats?${params}`);
  if (!res.ok) {
    throw new Error(`Bing Webmaster API trả về lỗi ${res.status}`);
  }
  const data = await res.json();
  const rows: unknown[] = Array.isArray(data?.d) ? data.d : [];

  return rows.map((r) => {
    const row = r as Record<string, unknown>;
    return {
      query: String(row.Query ?? ""),
      clicks: Number(row.Clicks ?? 0),
      impressions: Number(row.Impressions ?? 0),
      avgClickPosition: row.AvgClickPosition != null ? Number(row.AvgClickPosition) : null,
      avgImpressionPosition: row.AvgImpressionPosition != null ? Number(row.AvgImpressionPosition) : null,
    };
  });
}
