import { google } from "googleapis";

const SITE_URL = process.env.GSC_SITE_URL ?? `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://gomceramic.com"}/`;

export function gscConfigured(): boolean {
  return !!process.env.GSC_SERVICE_ACCOUNT_JSON;
}

// Auth via a Google Cloud service account added as a read-only user on the
// Search Console property (Settings -> Users and permissions) -- no
// interactive OAuth consent/redirect flow needed for a single-admin site.
// GSC_SERVICE_ACCOUNT_JSON holds the full downloaded service-account key
// file content as a single-line env var (not committed to the repo).
async function getSearchConsoleClient() {
  const json = process.env.GSC_SERVICE_ACCOUNT_JSON;
  if (!json) return null;

  const credentials = JSON.parse(json);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
  });
  return google.searchconsole({ version: "v1", auth });
}

export type SearchAnalyticsRow = {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

async function queryAnalytics(dimensions: string[], days: number, rowLimit: number): Promise<SearchAnalyticsRow[]> {
  const client = await getSearchConsoleClient();
  if (!client) return [];

  const end = new Date();
  const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);

  const res = await client.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody: { startDate: fmt(start), endDate: fmt(end), dimensions, rowLimit },
  });
  return (res.data.rows ?? []) as SearchAnalyticsRow[];
}

export function getTopQueries(days = 28, rowLimit = 20) {
  return queryAnalytics(["query"], days, rowLimit);
}

export function getTopPages(days = 28, rowLimit = 20) {
  return queryAnalytics(["page"], days, rowLimit);
}
