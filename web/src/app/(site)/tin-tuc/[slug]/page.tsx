import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { COMPANY } from "@/lib/site-config";
import { resolveMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { ShareButtons } from "@/components/site/ShareButtons";
import { estimateReadingMinutes } from "@/lib/reading-time";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gomceramic.com";

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(d);
}

// Rendered dynamically — see the note in san-pham/[slug]/page.tsx.
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
    path: `/tin-tuc/${post.slug}`,
    metaTitle: post.metaTitle,
    metaDescription: post.metaDescription,
    fallbackTitle: post.title,
    fallbackDescription: post.excerpt ?? post.title,
    image: post.coverImage,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  // Unpublished drafts stay 404 for public visitors -- admins preview them
  // from /admin/posts/[id] instead, so a guessed/shared URL never leaks
  // in-progress content before it's meant to go live.
  if (!post || !post.publishedAt) notFound();

  const relatedPosts = await prisma.post.findMany({
    where: { publishedAt: { not: null }, slug: { not: slug } },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  const breadcrumb = breadcrumbJsonLd([
    { name: "Trang chủ", url: siteUrl },
    { name: "Tin tức", url: `${siteUrl}/tin-tuc` },
    { name: post.title, url: `${siteUrl}/tin-tuc/${post.slug}` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <div className="page-hero" style={{ padding: "130px 0 40px" }}>
        <img className="bg" src={post.coverImage ?? ""} alt="" />
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Trang chủ</Link>
            <span>/</span>
            <Link href="/tin-tuc">Tin tức</Link>
            <span>/</span>
            <span>{post.title}</span>
          </div>
          <h1 style={{ maxWidth: "32ch" }}>{post.title}</h1>
          <p style={{ color: "rgba(255,255,255,.7)", fontSize: ".85rem" }}>
            {post.publishedAt && formatDate(post.publishedAt)} · {estimateReadingMinutes(post.contentHtml)} phút đọc
            · {COMPANY.name}
          </p>
        </div>
      </div>
      <section className="section-tight">
        <div className="container">
          <div className="article-body">
            {post.coverImage && <img src={post.coverImage} alt={post.title} loading="lazy" />}
            <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />

            <ShareButtons url={`${siteUrl}/tin-tuc/${post.slug}`} title={post.title} />

            <div
              className="cta-band"
              style={{ marginTop: 50, background: "var(--clay-100)", color: "var(--ink)" }}
            >
              <div>
                <h2 style={{ color: "var(--ink)" }}>Cần tư vấn chọn mẫu phù hợp?</h2>
                <p style={{ color: "var(--ink-soft)" }}>
                  Nhắn Zalo cho đội ngũ {COMPANY.name} để được gợi ý mẫu lọ hoa theo đúng nhu cầu.
                </p>
              </div>
              <a className="btn btn-primary" href={`https://zalo.me/${COMPANY.zalo}`} target="_blank" rel="noopener">
                Nhắn Zalo tư vấn
              </a>
            </div>
          </div>

          {relatedPosts.length > 0 && (
            <div style={{ maxWidth: 1080, margin: "70px auto 0" }}>
              <h2 style={{ fontSize: "1.4rem", marginBottom: 26 }}>Bài viết khác</h2>
              <div className="grid-3">
                {relatedPosts.map((rp) => (
                  <article className="article-card" key={rp.slug}>
                    <Link className="thumb" href={`/tin-tuc/${rp.slug}`}>
                      <img src={rp.coverImage ?? "/assets/img/placeholder.svg"} alt={rp.title} loading="lazy" />
                    </Link>
                    <div className="body">
                      <span className="date">{rp.publishedAt && formatDate(rp.publishedAt)}</span>
                      <h3 style={{ margin: "8px 0" }}>
                        <Link href={`/tin-tuc/${rp.slug}`}>{rp.title}</Link>
                      </h3>
                      <Link className="btn btn-sm btn-outline" href={`/tin-tuc/${rp.slug}`}>
                        Đọc tiếp
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
