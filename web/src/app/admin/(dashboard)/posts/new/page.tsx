import { createPostAction } from "@/lib/actions/admin-posts";
import { PostForm } from "@/components/admin/PostForm";
import { AdminBackLink } from "@/components/admin/AdminBackLink";

export default function NewPostPage() {
  return (
    <>
      <AdminBackLink href="/admin/posts" label="Quay lại danh sách bài viết" />
      <div className="admin-topbar">
        <h1>Viết bài mới</h1>
      </div>
      <PostForm action={createPostAction} submitLabel="Tạo bài viết" />
    </>
  );
}
