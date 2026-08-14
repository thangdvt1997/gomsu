import { SeoScoreWidget } from "@/components/admin/SeoScoreWidget";

export function SeoEditorPanel({
  metaTitle,
  metaDescription,
  titleFieldName = "name",
  contentFieldName,
}: {
  metaTitle?: string | null;
  metaDescription?: string | null;
  /** Name of the main title field on this form ("name" for products, "title" for posts). */
  titleFieldName?: string;
  /** Name of the main content field, if this entity has long-form content (e.g. "contentHtml"). */
  contentFieldName?: string;
}) {
  return (
    <div className="admin-panel" style={{ marginBottom: 20 }}>
      <h3 style={{ marginTop: 0 }}>SEO (tuỳ chọn — để trống sẽ dùng mặc định)</h3>
      <div className="field">
        <label>Meta title</label>
        <input type="text" name="metaTitle" defaultValue={metaTitle ?? ""} />
      </div>
      <div className="field">
        <label>Meta description</label>
        <textarea name="metaDescription" defaultValue={metaDescription ?? ""} rows={2} />
      </div>
      <SeoScoreWidget
        titleName={titleFieldName}
        metaTitleName="metaTitle"
        metaDescriptionName="metaDescription"
        contentName={contentFieldName}
      />
    </div>
  );
}
