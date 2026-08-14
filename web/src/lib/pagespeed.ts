export type PageSpeedResult = {
  score: number;
  lcp: string;
  cls: string;
  inp: string;
};

// Google's PageSpeed Insights API v5 works unauthenticated at a lower
// shared quota (fine for an admin manually checking a handful of URLs) --
// PAGESPEED_API_KEY is optional, only needed if this starts hitting quota
// limits from occasional manual checks.
export async function checkPageSpeed(url: string): Promise<PageSpeedResult> {
  const apiKey = process.env.PAGESPEED_API_KEY;
  const params = new URLSearchParams({ url, strategy: "mobile", category: "performance" });
  if (apiKey) params.set("key", apiKey);

  const res = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params}`);
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error?.message ?? `PageSpeed API trả về lỗi ${res.status}`);
  }
  const data = await res.json();

  const score = Math.round((data.lighthouseResult?.categories?.performance?.score ?? 0) * 100);
  const audits = data.lighthouseResult?.audits ?? {};
  const lcp = audits["largest-contentful-paint"]?.displayValue ?? "—";
  const cls = audits["cumulative-layout-shift"]?.displayValue ?? "—";
  const inp = audits["interaction-to-next-paint"]?.displayValue ?? "—";

  return { score, lcp, cls, inp };
}
