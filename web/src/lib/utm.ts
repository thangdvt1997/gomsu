const STORAGE_KEY = "gomsu-utm";

export const UTM_KEYS = ["utmSource", "utmMedium", "utmCampaign", "utmTerm", "utmContent", "gclid", "fbclid"] as const;
export type UtmKey = (typeof UTM_KEYS)[number];
export type UtmData = Partial<Record<UtmKey, string>>;

const URL_PARAM_BY_KEY: Record<UtmKey, string> = {
  utmSource: "utm_source",
  utmMedium: "utm_medium",
  utmCampaign: "utm_campaign",
  utmTerm: "utm_term",
  utmContent: "utm_content",
  gclid: "gclid",
  fbclid: "fbclid",
};

/** Reads UTM/click-id params from the current URL and merges them into
 * localStorage (last-touch: a fresh param overwrites the stored one, but a
 * page visited with no params keeps whatever was captured earlier in the
 * session so attribution survives browsing from landing page to checkout). */
export function captureUtmFromLocation() {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const fresh: UtmData = {};
  for (const key of UTM_KEYS) {
    const value = params.get(URL_PARAM_BY_KEY[key]);
    if (value) fresh[key] = value;
  }
  if (Object.keys(fresh).length === 0) return;
  const existing = readStoredUtm();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...existing, ...fresh }));
}

export function readStoredUtm(): UtmData {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UtmData) : {};
  } catch {
    return {};
  }
}
