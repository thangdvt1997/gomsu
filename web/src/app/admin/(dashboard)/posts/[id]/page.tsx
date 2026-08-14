import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { updatePostAction, deletePostAction } from "@/lib/actions/admin-posts";
import { PostForm } from "@/components/admin/PostForm";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <>
      <div className="admin-topbar">
        <h1>Sửa: {post.title}</h1>
        <form action={deletePostAction.bind(null, post.id)}>
          <button className="btn btn-danger" type="submit">
            Xoá bài viết
          </button>
        </form>
      </div>
      <PostForm action={updatePostAction.bind(null, post.id)} post={post} submitLabel="Lưu thay đổi" />
    </>
  );
}
