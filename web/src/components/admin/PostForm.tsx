"use client";

import { useState } from "react";
import { SeoEditorPanel } from "@/components/admin/SeoEditorPanel";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

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
    titleEn?: string | null;
    excerptEn?: string | null;
    contentHtmlEn?: string | null;
    metaTitleEn?: string | null;
    metaDescriptionEn?: string | null;
  };
  submitLabel: string;
};

const EXCERPT_RECOMMENDED = 160;

export function PostForm({ action, post, submitLabel }: PostFormProps) {
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [excerptEn, setExcerptEn] = useState(post?.excerptEn ?? "");

  return (
    <form action={action} className="post-form-layout">
      <div className="post-form-main">
        <div className="admin-panel" style={{ marginBottom: 20 }}>
          <div className="field">
            <label>Tiêu đề *</label>
            <input type="text" name="title" required defaultValue={post?.title} className="post-title-input" />
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Nội dung bài viết</label>
            <RichTextEditor name="contentHtml" defaultValue={post?.contentHtml} />
          </div>
        </div>

        <div className="admin-panel" style={{ marginBottom: 20 }}>
          <h3 style={{ marginTop: 0 }}>🇬🇧 English translation (optional)</h3>
          <p style={{ color: "var(--a-ink-soft)", fontSize: ".85rem" }}>
            Leave blank to fall back to the Vietnamese content above on the /en site.
          </p>
          <div className="field">
            <label>Title (EN)</label>
            <input type="text" name="titleEn" defaultValue={post?.titleEn ?? ""} className="post-title-input" />
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Content (EN)</label>
            <RichTextEditor name="contentHtmlEn" defaultValue={post?.contentHtmlEn ?? ""} placeholder="Optional English content..." />
          </div>
        </div>
      </div>

      <div className="post-form-side">
        <div className="admin-panel" style={{ marginBottom: 20 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <input type="checkbox" name="published" defaultChecked={!!post?.publishedAt} /> Xuất bản (hiển thị công
            khai)
          </label>
          <button className="btn btn-primary btn-block" type="submit">
            {submitLabel}
          </button>
        </div>

        <div className="admin-panel" style={{ marginBottom: 20 }}>
          <div className="field" style={{ marginBottom: 6 }}>
            <label>Mô tả ngắn (excerpt)</label>
            <textarea
              name="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              maxLength={220}
            />
          </div>
          <p className={`char-counter${excerpt.length > EXCERPT_RECOMMENDED ? " is-over" : ""}`}>
            {excerpt.length}/{EXCERPT_RECOMMENDED} ký tự gợi ý — hiển thị ở trang danh sách &amp; kết quả tìm kiếm
          </p>
        </div>

        <div className="admin-panel" style={{ marginBottom: 20 }}>
          <div className="field" style={{ marginBottom: 6 }}>
            <label>Excerpt (EN)</label>
            <textarea
              name="excerptEn"
              value={excerptEn}
              onChange={(e) => setExcerptEn(e.target.value)}
              rows={3}
              maxLength={220}
            />
          </div>
          <p className={`char-counter${excerptEn.length > EXCERPT_RECOMMENDED ? " is-over" : ""}`}>
            {excerptEn.length}/{EXCERPT_RECOMMENDED} characters recommended
          </p>
        </div>

        <SeoEditorPanel
          metaTitle={post?.metaTitle}
          metaDescription={post?.metaDescription}
          titleFieldName="title"
          contentFieldName="contentHtml"
        />

        <div className="admin-panel">
          <h3 style={{ marginTop: 0 }}>SEO (EN, optional)</h3>
          <div className="field">
            <label>Meta title (EN)</label>
            <input type="text" name="metaTitleEn" defaultValue={post?.metaTitleEn ?? ""} />
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Meta description (EN)</label>
            <textarea name="metaDescriptionEn" defaultValue={post?.metaDescriptionEn ?? ""} rows={2} />
          </div>
        </div>
      </div>
    </form>
  );
}
