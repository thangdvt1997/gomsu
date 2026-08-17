import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { estimateReadingMinutes } from "@/lib/reading-time";
import { pick } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Blog & Ceramic Care Guides",
  description: "Guides on choosing vases, glaze pairing, and caring for Bat Trang ceramics from the Gốm Sứ Trung Mừng team.",
  alternates: { languages: { vi: "/tin-tuc", en: "/en/tin-tuc" } },
};

export const dynamic = "force-dynamic";

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }).format(d);
}

export default async function EnglishBlogIndexPage() {
  const posts = await prisma.post.findMany({
    where: { publishedAt: { not: null } },
    orderBy: { publishedAt: "desc" },
  });

  const [latest, ...rest] = posts;

  return (
    <>
      <div className="page-hero">
        <img className="bg" src="/media/site/lifestyle-3.jpg" alt="" />
        <div className="container">
          <div className="breadcrumb">
            <Link href="/en">Home</Link>
            <span>/</span>
            <span>Blog</span>
          </div>
          <h1>Blog &amp; Ceramic Care Guides</h1>
          <p style={{ maxWidth: "60ch", color: "rgba(255,255,255,.82)" }}>
            Guides on choosing vases, glaze pairing, and caring for Bat Trang ceramics from the
            Gốm Sứ Trung Mừng team.
          </p>
        </div>
      </div>

      {posts.length === 0 ? (
        <section className="section-tight">
          <div className="container empty-state">No posts yet — check back soon.</div>
        </section>
      ) : (
        <section className="section-tight">
          <div className="container">
            {latest && (
              <Link href={`/en/tin-tuc/${latest.slug}`} className="article-featured" data-reveal>
                <div className="thumb">
                  <img src={latest.coverImage ?? "/assets/img/placeholder.svg"} alt={pick(latest.title, latest.titleEn, "en")} />
                </div>
                <div className="body">
                  <span className="eyebrow">Latest post</span>
                  <h2>{pick(latest.title, latest.titleEn, "en")}</h2>
                  <p>{pick(latest.excerpt ?? "", latest.excerptEn, "en")}</p>
                  <div className="meta-row">
                    <span>{latest.publishedAt && formatDate(latest.publishedAt)}</span>
                    <span>·</span>
                    <span>{estimateReadingMinutes(pick(latest.contentHtml, latest.contentHtmlEn, "en"))} min read</span>
                  </div>
                  <span className="btn btn-sm btn-outline">Read More</span>
                </div>
              </Link>
            )}

            {rest.length > 0 && (
              <div className="grid-3" style={{ marginTop: 44 }}>
                {rest.map((post) => (
                  <article className="article-card" data-reveal key={post.slug}>
                    <Link className="thumb" href={`/en/tin-tuc/${post.slug}`}>
                      <img src={post.coverImage ?? "/assets/img/placeholder.svg"} alt={pick(post.title, post.titleEn, "en")} loading="lazy" />
                    </Link>
                    <div className="body">
                      <div className="meta-row">
                        <span className="date">{post.publishedAt && formatDate(post.publishedAt)}</span>
                        <span>·</span>
                        <span>{estimateReadingMinutes(pick(post.contentHtml, post.contentHtmlEn, "en"))} min read</span>
                      </div>
                      <h3>
                        <Link href={`/en/tin-tuc/${post.slug}`}>{pick(post.title, post.titleEn, "en")}</Link>
                      </h3>
                      <p style={{ color: "var(--ink-soft)", fontSize: ".92rem" }}>{pick(post.excerpt ?? "", post.excerptEn, "en")}</p>
                      <Link className="btn btn-sm btn-outline" href={`/en/tin-tuc/${post.slug}`}>
                        Read More
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}
