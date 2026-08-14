import { prisma } from "@/lib/db";

export const SETTING_KEYS = {
  GA4_ID: "ga4_id",
  GTM_ID: "gtm_id",
  ANALYTICS_ENABLED: "analytics_enabled",
  GSC_VERIFICATION: "gsc_verification",
  BING_VERIFICATION: "bing_verification",
  NOTIFY_EMAIL: "notify_email",
  NOTIFY_EMAIL_ENABLED: "notify_email_enabled",
} as const;

export type SettingKey = (typeof SETTING_KEYS)[keyof typeof SETTING_KEYS];

/**
 * DB-backed settings win when set from /admin/settings; otherwise falls
 * back to the equivalent env var so nothing breaks for a fresh deploy that
 * hasn't touched the settings screen yet.
 */
export async function getSettings(): Promise<Record<SettingKey, string | null>> {
  const rows = await prisma.siteSetting.findMany();
  const fromDb = new Map(rows.map((r) => [r.key, r.value]));

  return {
    [SETTING_KEYS.GA4_ID]: fromDb.get(SETTING_KEYS.GA4_ID) ?? null,
    [SETTING_KEYS.GTM_ID]: fromDb.get(SETTING_KEYS.GTM_ID) ?? process.env.NEXT_PUBLIC_GTM_ID ?? null,
    [SETTING_KEYS.ANALYTICS_ENABLED]:
      fromDb.get(SETTING_KEYS.ANALYTICS_ENABLED) ??
      (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true" ? "true" : "false"),
    [SETTING_KEYS.GSC_VERIFICATION]:
      fromDb.get(SETTING_KEYS.GSC_VERIFICATION) ?? process.env.NEXT_PUBLIC_GSC_VERIFICATION ?? null,
    [SETTING_KEYS.BING_VERIFICATION]: fromDb.get(SETTING_KEYS.BING_VERIFICATION) ?? null,
    [SETTING_KEYS.NOTIFY_EMAIL]: fromDb.get(SETTING_KEYS.NOTIFY_EMAIL) ?? null,
    [SETTING_KEYS.NOTIFY_EMAIL_ENABLED]: fromDb.get(SETTING_KEYS.NOTIFY_EMAIL_ENABLED) ?? "false",
  };
}
