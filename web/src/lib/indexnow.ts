import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/db";

const KEY_SETTING = "indexnow_key";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gomceramic.com";

export async function getIndexNowKey(): Promise<string> {
  const existing = await prisma.siteSetting.findUnique({ where: { key: KEY_SETTING } });
  if (existing) return existing.value;

  const key = randomUUID().replace(/-/g, "");
  // Upsert (not create) -- two concurrent first-callers would otherwise
  // race on the same unique key and one insert would throw.
  const row = await prisma.siteSetting.upsert({
    where: { key: KEY_SETTING },
    create: { key: KEY_SETTING, value: key },
    update: {},
  });
  return row.value;
}

/**
 * Tells Bing (and IndexNow's other participating engines -- Yandex, Seznam,
 * Naver) that a page changed, so it can be recrawled without waiting for
 * the next scheduled crawl. Best-effort: never throws, since a failed ping
 * must not block the product/post save that triggered it.
 */
export async function pingIndexNow(paths: string[]) {
  if (!paths.length) return;
  try {
    const key = await getIndexNowKey();
    const host = new URL(siteUrl).host;
    const urlList = paths.map((p) => `${siteUrl}${p}`);

    await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host, key, keyLocation: `${siteUrl}/${key}.txt`, urlList }),
    });
  } catch (err) {
    console.error("IndexNow ping failed:", err);
  }
}
