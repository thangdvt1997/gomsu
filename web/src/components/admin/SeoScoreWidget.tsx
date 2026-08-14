"use client";

import { useEffect, useRef, useState } from "react";

type Check = { label: string; ok: boolean };

type SeoScoreWidgetProps = {
  titleName: string;
  metaTitleName: string;
  metaDescriptionName: string;
  /** Name of a field holding the main body content (HTML or plain text) --
   * omit for entities with no long-form content (there's nothing useful to
   * check a word count against). */
  contentName?: string;
};

// Rule-based, client-only scoring -- same checks a Yoast/Rank Math-style
// on-page SEO tool runs (title/description length, content length), just
// simple enough to not need any external service or AI call. Re-evaluated
// on a short poll instead of only on native `input` events because the
// rich-text editor's hidden field is updated via React state, not a real
// DOM input event.
export function SeoScoreWidget({ titleName, metaTitleName, metaDescriptionName, contentName }: SeoScoreWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [checks, setChecks] = useState<Check[]>([]);

  useEffect(() => {
    const form = containerRef.current?.closest("form");
    if (!form) return;

    function compute() {
      const title = (form!.elements.namedItem(titleName) as HTMLInputElement | null)?.value ?? "";
      const metaTitle = (form!.elements.namedItem(metaTitleName) as HTMLInputElement | null)?.value ?? "";
      const metaDescription =
        (form!.elements.namedItem(metaDescriptionName) as HTMLTextAreaElement | null)?.value ?? "";
      const effectiveTitle = metaTitle || title;

      const results: Check[] = [
        { label: "Đã có tiêu đề chính", ok: title.trim().length > 0 },
        {
          label: `Độ dài tiêu đề SEO 40-65 ký tự (hiện tại: ${effectiveTitle.length})`,
          ok: effectiveTitle.length >= 40 && effectiveTitle.length <= 65,
        },
        {
          label: `Độ dài mô tả SEO 100-160 ký tự (hiện tại: ${metaDescription.length})`,
          ok: metaDescription.length >= 100 && metaDescription.length <= 160,
        },
      ];

      if (contentName) {
        const raw = (form!.elements.namedItem(contentName) as HTMLInputElement | HTMLTextAreaElement | null)?.value ?? "";
        const text = raw.replace(/<[^>]+>/g, " ");
        const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
        results.push({ label: `Nội dung nên có tối thiểu 300 từ (hiện tại: ${wordCount})`, ok: wordCount >= 300 });

        const imgTagCount = (raw.match(/<img\b/gi) ?? []).length;
        const imgWithAltCount = (raw.match(/<img\b[^>]*\balt=["'][^"']+["']/gi) ?? []).length;
        if (imgTagCount > 0) {
          results.push({
            label: `Ảnh trong nội dung có mô tả alt (${imgWithAltCount}/${imgTagCount})`,
            ok: imgWithAltCount === imgTagCount,
          });
        }
      }

      setChecks(results);
    }

    compute();
    const interval = setInterval(compute, 1000);
    return () => clearInterval(interval);
  }, [titleName, metaTitleName, metaDescriptionName, contentName]);

  const passCount = checks.filter((c) => c.ok).length;

  return (
    <div ref={containerRef} style={{ marginTop: 16, paddingTop: 16, borderTop: "1px dashed var(--a-line)" }}>
      <h4 style={{ margin: "0 0 8px" }}>
        Điểm SEO nhanh ({passCount}/{checks.length})
      </h4>
      <ul style={{ margin: 0, paddingLeft: 18, fontSize: ".85rem" }}>
        {checks.map((c) => (
          <li key={c.label} style={{ color: c.ok ? "#1f6b1f" : "#a83232", marginBottom: 4 }}>
            {c.ok ? "✓" : "✗"} {c.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
