import { SeoEditorPanel } from "@/components/admin/SeoEditorPanel";

type PostFormProps = {
  action: (formData: FormData) => void;
  post?: {
    title: string;
    excerpt: string | null;
    contentHtml: string;
    coverImage: string | null;
    publishedAt: Date | null;
    metaTitle: string | null;
    metaDescription: string | null;
  };
  submitLabel: string;
};

export function PostForm({ action, post, submitLabel }: PostFormProps) {
  return (
    <form action={action}>
      <div className="admin-panel" style={{ marginBottom: 20 }}>
        <div className="field">
          <label>Tiêu đề *</label>
          <input type="text" name="title" required defaultValue={post?.title} />
        </div>
        <div className="field">
          <label>Mô tả ngắn (excerpt)</label>
          <input type="text" name="excerpt" defaultValue={post?.excerpt ?? ""} />
        </div>
        <div className="field">
          <label>Ảnh bìa (đường dẫn /media/...)</label>
          <input type="text" name="coverImage" defaultValue={post?.coverImage ?? ""} placeholder="/media/site/lifestyle-1.jpg" />
        </div>
        <div className="field">
          <label>Nội dung (HTML)</label>
          <textarea name="contentHtml" required defaultValue={post?.contentHtml} rows={14} />
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input type="checkbox" name="published" defaultChecked={!!post?.publishedAt} /> Xuất bản (hiển thị công khai)
        </label>
      </div>
      <SeoEditorPanel metaTitle={post?.metaTitle} metaDescription={post?.metaDescription} />
      <button className="btn btn-primary" type="submit">
        {submitLabel}
      </button>
    </form>
  );
}
