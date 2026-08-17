import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gomceramic.com";

// Same reasoning as the force-dynamic pages: no DATABASE_URL/network at
// `docker build` time, and a static bake would go stale between deploys.
export const dynamic = "force-dynamic";

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "daily" },
  { path: "/san-pham", priority: 0.9, changeFrequency: "daily" },
  { path: "/bao-gia", priority: 0.8, changeFrequency: "weekly" },
  { path: "/gioi-thieu", priority: 0.5, changeFrequency: "monthly" },
  { path: "/tin-tuc", priority: 0.6, changeFrequency: "weekly" },
  { path: "/lien-he", priority: 0.5, changeFrequency: "monthly" },
  { path: "/qua-tang-doanh-nghiep", priority: 0.6, changeFrequency: "monthly" },
];

// Vietnamese is the canonical/default locale (unprefixed URLs, matches all
// existing indexed links); English lives under /en and is linked back via
// hreflang alternates rather than being sitemapped as fully separate pages.
function withEnglishAlternate(path: string) {
  const viUrl = `${siteUrl}${path}`;
  const enUrl = path === "/" ? `${siteUrl}/en` : `${siteUrl}/en${path}`;
  return { languages: { vi: viUrl, en: enUrl } };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, posts, glazes] = await Promise.all([
    prisma.product.findMany({ where: { isDraft: false }, select: { slug: true, updatedAt: true } }),
    prisma.post.findMany({ where: { publishedAt: { not: null } }, select: { slug: true, updatedAt: true } }),
    prisma.glaze.findMany({ select: { key: true } }),
  ]);

  return [
    ...STATIC_ROUTES.map((r) => ({
      url: `${siteUrl}${r.path}`,
      lastModified: new Date(),
      changeFrequency: r.changeFrequency,
      priority: r.priority,
      alternates: withEnglishAlternate(r.path),
    })),
    ...products.map((p) => ({
      url: `${siteUrl}/san-pham/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
      alternates: withEnglishAlternate(`/san-pham/${p.slug}`),
    })),
    ...posts.map((p) => ({
      url: `${siteUrl}/tin-tuc/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.5,
      alternates: withEnglishAlternate(`/tin-tuc/${p.slug}`),
    })),
    ...glazes.map((g) => ({
      url: `${siteUrl}/san-pham/mau-men/${g.key}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
      alternates: withEnglishAlternate(`/san-pham/mau-men/${g.key}`),
    })),
  ];
}
