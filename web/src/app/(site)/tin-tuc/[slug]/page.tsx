import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { COMPANY } from "@/lib/site-config";
import { resolveMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";

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
  if (!post) return {};
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
  if (!post) notFound();

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
            {post.publishedAt && formatDate(post.publishedAt)} · {COMPANY.name}
          </p>
        </div>
      </div>
      <section className="section-tight">
        <div className="container">
          <div className="article-body">
            {post.coverImage && <img src={post.coverImage} alt={post.title} loading="lazy" />}
            <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
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
        </div>
      </section>
    </>
  );
}
