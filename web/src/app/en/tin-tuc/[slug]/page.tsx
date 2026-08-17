import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { COMPANY } from "@/lib/site-config";
import { resolveMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { ShareButtons } from "@/components/site/ShareButtons";
import { estimateReadingMinutes } from "@/lib/reading-time";
import { pick } from "@/lib/i18n";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gomceramic.com";

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }).format(d);
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post || !post.publishedAt) return {};
  return resolveMetadata({
    path: `/en/tin-tuc/${post.slug}`,
    metaTitle: post.metaTitleEn,
    metaDescription: post.metaDescriptionEn,
    fallbackTitle: pick(post.title, post.titleEn, "en"),
    fallbackDescription: pick(post.excerpt ?? post.title, post.excerptEn, "en"),
    image: post.coverImage,
    altLocalePath: `/tin-tuc/${post.slug}`,
  });
}

export default async function EnglishBlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post || !post.publishedAt) notFound();

  const relatedPosts = await prisma.post.findMany({
    where: { publishedAt: { not: null }, slug: { not: slug } },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  const title = pick(post.title, post.titleEn, "en");
  const contentHtml = pick(post.contentHtml, post.contentHtmlEn, "en");

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: `${siteUrl}/en` },
    { name: "Blog", url: `${siteUrl}/en/tin-tuc` },
    { name: title, url: `${siteUrl}/en/tin-tuc/${post.slug}` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <div className="page-hero" style={{ padding: "130px 0 40px" }}>
        <img className="bg" src={post.coverImage ?? ""} alt="" />
        <div className="container">
          <div className="breadcrumb">
            <Link href="/en">Home</Link>
            <span>/</span>
            <Link href="/en/tin-tuc">Blog</Link>
            <span>/</span>
            <span>{title}</span>
          </div>
          <h1 style={{ maxWidth: "32ch" }}>{title}</h1>
          <p style={{ color: "rgba(255,255,255,.7)", fontSize: ".85rem" }}>
            {post.publishedAt && formatDate(post.publishedAt)} · {estimateReadingMinutes(contentHtml)} min read ·{" "}
            {COMPANY.name}
          </p>
        </div>
      </div>
      <section className="section-tight">
        <div className="container">
          <div className="article-body">
            {post.coverImage && <img src={post.coverImage} alt={title} loading="lazy" />}
            <div dangerouslySetInnerHTML={{ __html: contentHtml }} />

            <ShareButtons url={`${siteUrl}/en/tin-tuc/${post.slug}`} title={title} locale="en" />

            <div className="cta-band" style={{ marginTop: 50, background: "var(--clay-100)", color: "var(--ink)" }}>
              <div>
                <h2 style={{ color: "var(--ink)" }}>Need help choosing the right design?</h2>
                <p style={{ color: "var(--ink-soft)" }}>
                  Message the {COMPANY.name} team on Zalo for design recommendations tailored to your needs.
                </p>
              </div>
              <a className="btn btn-primary" href={`https://zalo.me/${COMPANY.zalo}`} target="_blank" rel="noopener">
                Message on Zalo
              </a>
            </div>
          </div>

          {relatedPosts.length > 0 && (
            <div style={{ maxWidth: 1080, margin: "70px auto 0" }}>
              <h2 style={{ fontSize: "1.4rem", marginBottom: 26 }}>More Articles</h2>
              <div className="grid-3">
                {relatedPosts.map((rp) => (
                  <article className="article-card" key={rp.slug}>
                    <Link className="thumb" href={`/en/tin-tuc/${rp.slug}`}>
                      <img
                        src={rp.coverImage ?? "/assets/img/placeholder.svg"}
                        alt={pick(rp.title, rp.titleEn, "en")}
                        loading="lazy"
                      />
                    </Link>
                    <div className="body">
                      <span className="date">{rp.publishedAt && formatDate(rp.publishedAt)}</span>
                      <h3 style={{ margin: "8px 0" }}>
                        <Link href={`/en/tin-tuc/${rp.slug}`}>{pick(rp.title, rp.titleEn, "en")}</Link>
                      </h3>
                      <Link className="btn btn-sm btn-outline" href={`/en/tin-tuc/${rp.slug}`}>
                        Read More
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
