import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gomceramic.com";

/**
 * Single fallback-resolution point for the on-page SEO editor fields
 * (metaTitle/metaDescription, set from the admin CMS) shared by every
 * entity's generateMetadata() -- Product, Post, and any future page type.
 */
export function resolveMetadata(opts: {
  path: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  fallbackTitle: string;
  fallbackDescription: string;
  image?: string | null;
  /** The equivalent path on the OTHER locale (e.g. pass the vi path when
   * generating metadata for an /en page, and vice versa), for hreflang. */
  altLocalePath?: string;
}): Metadata {
  const title = opts.metaTitle || opts.fallbackTitle;
  const description = opts.metaDescription || opts.fallbackDescription;
  const url = `${siteUrl}${opts.path}`;
  const isEn = opts.path.startsWith("/en");

  const languages = opts.altLocalePath
    ? isEn
      ? { vi: `${siteUrl}${opts.altLocalePath}`, en: url }
      : { vi: url, en: `${siteUrl}${opts.altLocalePath}` }
    : undefined;

  return {
    title,
    description,
    alternates: { canonical: url, languages },
    openGraph: {
      title,
      description,
      url,
      images: opts.image ? [opts.image] : undefined,
    },
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
