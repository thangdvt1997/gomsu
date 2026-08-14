"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { SETTING_KEYS } from "@/lib/settings";

async function upsertSetting(key: string, value: string) {
  await prisma.siteSetting.upsert({
    where: { key },
    create: { key, value },
    update: { value },
  });
}

export async function updateSettingsAction(formData: FormData) {
  const ga4Id = String(formData.get("ga4Id") ?? "").trim();
  const gtmId = String(formData.get("gtmId") ?? "").trim();
  const analyticsEnabled = formData.get("analyticsEnabled") === "on";
  const gscVerification = String(formData.get("gscVerification") ?? "").trim();
  const bingVerification = String(formData.get("bingVerification") ?? "").trim();
  const notifyEmail = String(formData.get("notifyEmail") ?? "").trim();
  const notifyEmailEnabled = formData.get("notifyEmailEnabled") === "on";

  await Promise.all([
    upsertSetting(SETTING_KEYS.GA4_ID, ga4Id),
    upsertSetting(SETTING_KEYS.GTM_ID, gtmId),
    upsertSetting(SETTING_KEYS.ANALYTICS_ENABLED, analyticsEnabled ? "true" : "false"),
    upsertSetting(SETTING_KEYS.GSC_VERIFICATION, gscVerification),
    upsertSetting(SETTING_KEYS.BING_VERIFICATION, bingVerification),
    upsertSetting(SETTING_KEYS.NOTIFY_EMAIL, notifyEmail),
    upsertSetting(SETTING_KEYS.NOTIFY_EMAIL_ENABLED, notifyEmailEnabled ? "true" : "false"),
  ]);

  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
}
