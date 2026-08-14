"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { SEO_CHECKLIST_SETTING_KEY, type SeoChecklistState } from "@/lib/seo-checklist";

export async function markChecklistItemAction(itemKey: string) {
  const row = await prisma.siteSetting.findUnique({ where: { key: SEO_CHECKLIST_SETTING_KEY } });
  const state: SeoChecklistState = row ? JSON.parse(row.value) : {};
  state[itemKey] = new Date().toISOString();

  await prisma.siteSetting.upsert({
    where: { key: SEO_CHECKLIST_SETTING_KEY },
    create: { key: SEO_CHECKLIST_SETTING_KEY, value: JSON.stringify(state) },
    update: { value: JSON.stringify(state) },
  });
  revalidatePath("/admin/seo");
}
