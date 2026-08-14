import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gomceramic.com";

// Without this, Next prerenders robots.txt at `docker build` time (no
// dynamic API is used here) -- before web/.env is even in the build
// context (excluded via .dockerignore) -- baking in the fallback URL
// instead of the runtime value docker-compose injects via env_file.
export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin/", "/api/"] },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
