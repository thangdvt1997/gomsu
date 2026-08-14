import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <div className="admin-topbar">
        <h1>Bài viết ({posts.length})</h1>
        <Link className="btn btn-primary" href="/admin/posts/new">
          + Viết bài mới
        </Link>
      </div>
      <div className="admin-panel">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Trạng thái</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id}>
                <td>{p.title}</td>
                <td>
                  <span className={`status-badge ${p.publishedAt ? "status-CONTACTED" : "status-CLOSED"}`}>
                    {p.publishedAt ? "Đã xuất bản" : "Bản nháp"}
                  </span>
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
      </div>
    </>
  );
}
