import { MAX_SIZE_ROWS } from "@/lib/constants";

type Category = { id: string; label: string };
type Glaze = { id: string; key: string; label: string; hex: string };
type ProductSize = { label: string | null; heightCm: unknown; mouthCm: unknown; priceVnd: number | null };

type ProductFormProps = {
  action: (formData: FormData) => void;
  categories: Category[];
  glazes: Glaze[];
  product?: {
    name: string;
    code: string;
    categoryId: string;
    tag: string | null;
    description: string;
    featured: boolean;
    isDraft: boolean;
    metaTitle: string | null;
    metaDescription: string | null;
    sizes: ProductSize[];
    colors: { glaze: { key: string } }[];
  };
  submitLabel: string;
};

export function ProductForm({ action, categories, glazes, product, submitLabel }: ProductFormProps) {
  const selectedColorKeys = new Set(product?.colors.map((c) => c.glaze.key) ?? []);
  const sizeRows = Array.from({ length: MAX_SIZE_ROWS }, (_, i) => product?.sizes[i]);

  return (
    <form action={action}>
      <div className="admin-panel" style={{ marginBottom: 20 }}>
        <div className="form-row">
          <div className="field">
            <label>Tên sản phẩm *</label>
            <input type="text" name="name" required defaultValue={product?.name} />
          </div>
          <div className="field">
            <label>Mã hàng (code) *</label>
            <input type="text" name="code" required defaultValue={product?.code} placeholder="TM-061" />
          </div>
        </div>
        <div className="form-row">
          <div className="field">
            <label>Danh mục *</label>
            <select name="categoryId" required defaultValue={product?.categoryId}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field" style={{ display: "flex", gap: 20, alignItems: "center", paddingTop: 22 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 0 }}>
              <input type="checkbox" name="featured" defaultChecked={product?.featured} /> Nổi bật
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 0 }}>
              <input type="checkbox" name="isDraft" defaultChecked={product?.isDraft} /> Bản nháp (ẩn khỏi site)
            </label>
          </div>
        </div>
        <div className="field">
          <label>Câu tagline ngắn</label>
          <input type="text" name="tag" defaultValue={product?.tag ?? ""} />
        </div>
        <div className="field">
          <label>Mô tả chi tiết</label>
          <textarea name="description" defaultValue={product?.description} rows={6} />
        </div>
      </div>

      <div className="admin-panel" style={{ marginBottom: 20 }}>
        <h3 style={{ marginTop: 0 }}>Kích thước &amp; giá</h3>
        <p style={{ color: "var(--a-ink-soft)", fontSize: ".85rem" }}>
          Để trống Giá nếu sản phẩm size đó chỉ nhận &quot;Liên hệ&quot;. Để trống toàn bộ dòng nếu không dùng.
        </p>
        {sizeRows.map((s, i) => (
          <div className="repeater-row" key={i}>
            <div className="field">
              <label>Nhãn (S1, Số 1...)</label>
              <input type="text" name={`size_label_${i}`} defaultValue={s?.label ?? ""} />
            </div>
            <div className="field">
              <label>Cao (cm)</label>
              <input type="text" name={`size_height_${i}`} defaultValue={s?.heightCm != null ? String(s.heightCm) : ""} />
            </div>
            <div className="field">
              <label>Miệng (cm)</label>
              <input type="text" name={`size_mouth_${i}`} defaultValue={s?.mouthCm != null ? String(s.mouthCm) : ""} />
            </div>
            <div className="field">
              <label>Giá (VND)</label>
              <input type="text" name={`size_price_${i}`} defaultValue={s?.priceVnd != null ? String(s.priceVnd) : ""} />
            </div>
          </div>
        ))}
      </div>

      <div className="admin-panel" style={{ marginBottom: 20 }}>
        <h3 style={{ marginTop: 0 }}>Tông men có sẵn</h3>
        <div>
          {glazes.map((g) => (
            <label key={g.key} className={`tag-pill${selectedColorKeys.has(g.key) ? " is-checked" : ""}`}>
              <input type="checkbox" name="colors" value={g.key} defaultChecked={selectedColorKeys.has(g.key)} style={{ marginRight: 4 }} />
              <span style={{ display: "inline-block", width: 12, height: 12, borderRadius: "50%", background: g.hex }} />
              {g.label}
            </label>
          ))}
        </div>
      </div>

      <div className="admin-panel" style={{ marginBottom: 20 }}>
        <h3 style={{ marginTop: 0 }}>SEO (tuỳ chọn — để trống sẽ dùng mặc định)</h3>
        <div className="field">
          <label>Meta title</label>
          <input type="text" name="metaTitle" defaultValue={product?.metaTitle ?? ""} />
        </div>
        <div className="field">
          <label>Meta description</label>
          <textarea name="metaDescription" defaultValue={product?.metaDescription ?? ""} rows={2} />
        </div>
      </div>

      <button className="btn btn-primary" type="submit">
        {submitLabel}
      </button>
    </form>
  );
}
