import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(d);
}

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });
  const publishedCount = posts.filter((p) => p.publishedAt).length;

  return (
    <>
      <div className="admin-topbar">
        <h1>Bài viết ({posts.length})</h1>
        <Link className="btn btn-primary" href="/admin/posts/new">
          + Viết bài mới
        </Link>
      </div>

      <div className="admin-stats" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <div className="admin-stat">
          <b>{posts.length}</b>
          <span>Tổng số bài viết</span>
        </div>
        <div className="admin-stat">
          <b>{publishedCount}</b>
          <span>Đã xuất bản</span>
        </div>
        <div className="admin-stat">
          <b>{posts.length - publishedCount}</b>
          <span>Bản nháp</span>
        </div>
      </div>

      <div className="admin-panel">
        {posts.length === 0 ? (
          <p style={{ color: "var(--a-ink-soft)", margin: 0 }}>Chưa có bài viết nào. Bấm &quot;Viết bài mới&quot; để bắt đầu.</p>
        ) : (
          <table className="admin-table post-table">
            <thead>
              <tr>
                <th></th>
                <th>Bài viết</th>
                <th>Trạng thái</th>
                <th>Ngày</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id}>
                  <td>
                    <img
                      src={p.coverImage ?? "/assets/img/placeholder.svg"}
                      alt=""
                      style={{ width: 64, height: 64, borderRadius: 8 }}
                    />
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>{p.title}</div>
                    <div style={{ color: "var(--a-ink-soft)", fontSize: ".85rem", maxWidth: 420 }}>
                      {p.excerpt ?? "—"}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${p.publishedAt ? "status-CONTACTED" : "status-CLOSED"}`}>
                      {p.publishedAt ? "Đã xuất bản" : "Bản nháp"}
                    </span>
                  </td>
                  <td style={{ color: "var(--a-ink-soft)", fontSize: ".85rem", whiteSpace: "nowrap" }}>
                    {p.publishedAt ? formatDate(p.publishedAt) : formatDate(p.createdAt)}
                  </td>
                  <td>
                    <Link className="btn btn-sm btn-outline" href={`/admin/posts/${p.id}`}>
                      Sửa
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
