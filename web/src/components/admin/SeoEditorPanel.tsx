export function SeoEditorPanel({
  metaTitle,
  metaDescription,
}: {
  metaTitle?: string | null;
  metaDescription?: string | null;
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
    </div>
  );
}
