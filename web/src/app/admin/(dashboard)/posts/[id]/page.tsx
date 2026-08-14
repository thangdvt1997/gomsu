import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { updatePostAction, deletePostAction } from "@/lib/actions/admin-posts";
import { uploadPostCoverAction } from "@/lib/actions/admin-upload";
import { PostForm } from "@/components/admin/PostForm";
import { AdminBackLink } from "@/components/admin/AdminBackLink";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <>
      <AdminBackLink href="/admin/posts" label="Quay lại danh sách bài viết" />
      <div className="admin-topbar">
        <h1>
          Sửa: {post.title}{" "}
          <span className={`status-badge ${post.publishedAt ? "status-CONTACTED" : "status-CLOSED"}`} style={{ verticalAlign: "middle", marginLeft: 8 }}>
            {post.publishedAt ? "Đã xuất bản" : "Bản nháp"}
          </span>
        </h1>
        <div style={{ display: "flex", gap: 8 }}>
          {post.publishedAt && (
            <a className="btn btn-outline" href={`/tin-tuc/${post.slug}`} target="_blank" rel="noopener">
              Xem bài viết
            </a>
          )}
          <form action={deletePostAction.bind(null, post.id)}>
            <button className="btn btn-danger" type="submit">
              Xoá bài viết
            </button>
          </form>
        </div>
      </div>

      <div className="admin-panel" style={{ marginBottom: 20 }}>
        <h3 style={{ marginTop: 0 }}>Ảnh bìa</h3>
        {post.coverImage && (
          <img
            src={post.coverImage}
            alt=""
            style={{ width: 220, height: 140, objectFit: "cover", borderRadius: 8, marginBottom: 14, display: "block" }}
          />
        )}
        <form action={uploadPostCoverAction.bind(null, post.id)} style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input type="file" name="file" accept="image/*" required />
          <button className="btn btn-outline" type="submit">
            Tải ảnh lên
          </button>
        </form>
      </div>

      <PostForm action={updatePostAction.bind(null, post.id)} post={post} submitLabel="Lưu thay đổi" />
    </>
  );
}
