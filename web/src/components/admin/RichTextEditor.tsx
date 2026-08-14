"use client";

import { useCallback, useRef, useState, type ChangeEvent } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { uploadPostContentImageAction } from "@/lib/actions/admin-upload";

type RichTextEditorProps = {
  name: string;
  defaultValue?: string;
  placeholder?: string;
};

function ToolbarButton({
  active,
  disabled,
  label,
  title,
  onClick,
}: {
  active?: boolean;
  disabled?: boolean;
  label: string;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`rte-btn${active ? " is-active" : ""}`}
      title={title}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export function RichTextEditor({ name, defaultValue, placeholder }: RichTextEditorProps) {
  const [html, setHtml] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true }),
      Image.configure({ HTMLAttributes: { loading: "lazy" } }),
      Placeholder.configure({
        placeholder: placeholder ?? "Bắt đầu viết nội dung bài viết…",
      }),
    ],
    content: defaultValue ?? "",
    editorProps: {
      attributes: { class: "rte-content" },
    },
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
  });

  const insertImage = useCallback(
    async (file: File) => {
      if (!editor) return;
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const result = await uploadPostContentImageAction(formData);
        if ("url" in result) {
          editor.chain().focus().setImage({ src: result.url }).run();
        } else {
          window.alert(result.error);
        }
      } finally {
        setUploading(false);
      }
    },
    [editor],
  );

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) insertImage(file);
    e.target.value = "";
  };

  const setLink = useCallback(() => {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Nhập đường dẫn (URL):", previous ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return (
      <div className="rte-wrap">
        <div className="rte-loading">Đang tải trình soạn thảo…</div>
      </div>
    );
  }

  return (
    <div className="rte-wrap">
      <div className="rte-toolbar">
        <ToolbarButton
          label="B"
          title="In đậm"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <ToolbarButton
          label="I"
          title="In nghiêng"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <ToolbarButton
          label="U"
          title="Gạch chân"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        />
        <ToolbarButton
          label="S"
          title="Gạch ngang"
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        />
        <span className="rte-sep" />
        <ToolbarButton
          label="Tiêu đề lớn"
          title="Tiêu đề lớn (H2)"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        />
        <ToolbarButton
          label="Tiêu đề nhỏ"
          title="Tiêu đề nhỏ (H3)"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        />
        <span className="rte-sep" />
        <ToolbarButton
          label="• Danh sách"
          title="Danh sách gạch đầu dòng"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
        <ToolbarButton
          label="1. Danh sách"
          title="Danh sách đánh số"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />
        <ToolbarButton
          label="❝ Trích dẫn"
          title="Trích dẫn"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        />
        <span className="rte-sep" />
        <ToolbarButton label="🔗 Liên kết" title="Chèn liên kết" active={editor.isActive("link")} onClick={setLink} />
        <ToolbarButton
          label={uploading ? "Đang tải…" : "🖼 Ảnh"}
          title="Chèn ảnh vào bài viết"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
        />
        <span className="rte-sep" />
        <ToolbarButton label="↺" title="Hoàn tác" onClick={() => editor.chain().focus().undo().run()} />
        <ToolbarButton label="↻" title="Làm lại" onClick={() => editor.chain().focus().redo().run()} />
      </div>
      <EditorContent editor={editor} />
      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
      <input type="hidden" name={name} value={html} />
    </div>
  );
}
