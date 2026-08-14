import { createPostAction } from "@/lib/actions/admin-posts";
import { PostForm } from "@/components/admin/PostForm";

export default function NewPostPage() {
  return (
    <>
      <div className="admin-topbar">
        <h1>Viết bài mới</h1>
      </div>
      <PostForm action={createPostAction} submitLabel="Tạo bài viết" />
    </>
  );
}
