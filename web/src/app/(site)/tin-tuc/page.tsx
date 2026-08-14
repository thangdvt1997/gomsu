import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { estimateReadingMinutes } from "@/lib/reading-time";

export const metadata: Metadata = {
  title: "Tin Tức & Cẩm Nang Gốm Sứ",
  description:
    "Kiến thức chọn lọ hoa, phối màu men và bảo quản gốm sứ Bát Tràng từ đội ngũ Gốm Sứ Trung Mừng.",
};

export const dynamic = "force-dynamic";

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(d);
}

export default async function BlogIndexPage() {
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
            <Link href="/">Trang chủ</Link>
            <span>/</span>
            <span>Tin tức</span>
          </div>
          <h1>Tin Tức &amp; Cẩm Nang Gốm Sứ</h1>
          <p style={{ maxWidth: "60ch", color: "rgba(255,255,255,.82)" }}>
            Kiến thức chọn lọ hoa, phối màu men và bảo quản gốm sứ Bát Tràng từ đội ngũ Gốm Sứ
            Trung Mừng.
          </p>
        </div>
      </div>

      {posts.length === 0 ? (
        <section className="section-tight">
          <div className="container empty-state">Chưa có bài viết nào, quay lại sau nhé.</div>
        </section>
      ) : (
        <section className="section-tight">
          <div className="container">
            {latest && (
              <Link href={`/tin-tuc/${latest.slug}`} className="article-featured" data-reveal>
                <div className="thumb">
                  <img src={latest.coverImage ?? "/assets/img/placeholder.svg"} alt={latest.title} />
                </div>
                <div className="body">
                  <span className="eyebrow">Bài viết mới nhất</span>
                  <h2>{latest.title}</h2>
                  <p>{latest.excerpt}</p>
                  <div className="meta-row">
                    <span>{latest.publishedAt && formatDate(latest.publishedAt)}</span>
                    <span>·</span>
                    <span>{estimateReadingMinutes(latest.contentHtml)} phút đọc</span>
                  </div>
                  <span className="btn btn-sm btn-outline">Đọc tiếp</span>
                </div>
              </Link>
            )}

            {rest.length > 0 && (
              <div className="grid-3" style={{ marginTop: 44 }}>
                {rest.map((post) => (
                  <article className="article-card" data-reveal key={post.slug}>
                    <Link className="thumb" href={`/tin-tuc/${post.slug}`}>
                      <img src={post.coverImage ?? "/assets/img/placeholder.svg"} alt={post.title} loading="lazy" />
                    </Link>
                    <div className="body">
                      <div className="meta-row">
                        <span className="date">{post.publishedAt && formatDate(post.publishedAt)}</span>
                        <span>·</span>
                        <span>{estimateReadingMinutes(post.contentHtml)} phút đọc</span>
                      </div>
                      <h3>
                        <Link href={`/tin-tuc/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <p style={{ color: "var(--ink-soft)", fontSize: ".92rem" }}>{post.excerpt}</p>
                      <Link className="btn btn-sm btn-outline" href={`/tin-tuc/${post.slug}`}>
                        Đọc tiếp
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
