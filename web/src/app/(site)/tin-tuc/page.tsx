import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";

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
    orderBy: { publishedAt: "asc" },
  });

  return (
    <>
      <div className="page-hero">
        <img className="bg" src="/media/site/lifestyle-3-thumb.jpg" alt="" />
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
      <section className="section-tight">
        <div className="container grid-3">
          {posts.map((post) => (
            <article className="article-card" data-reveal key={post.slug}>
              <Link className="thumb" href={`/tin-tuc/${post.slug}`}>
                <img src={post.coverImage ?? "/assets/img/placeholder.svg"} alt={post.title} loading="lazy" />
              </Link>
              <div className="body">
                <span className="date">{post.publishedAt && formatDate(post.publishedAt)}</span>
                <h3 style={{ margin: "8px 0" }}>
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
      </section>
    </>
  );
}
