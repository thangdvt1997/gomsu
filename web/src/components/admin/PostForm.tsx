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
  };
  submitLabel: string;
};

const EXCERPT_RECOMMENDED = 160;

export function PostForm({ action, post, submitLabel }: PostFormProps) {
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");

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

        <SeoEditorPanel
          metaTitle={post?.metaTitle}
          metaDescription={post?.metaDescription}
          titleFieldName="title"
          contentFieldName="contentHtml"
        />
      </div>
    </form>
  );
}
