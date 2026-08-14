"use client";

import { useState } from "react";
import type { PageSpeedResult } from "@/lib/pagespeed";

export function PageSpeedChecker({ defaultUrl }: { defaultUrl: string }) {
  const [url, setUrl] = useState(defaultUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PageSpeedResult | null>(null);

  async function handleCheck() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`/api/admin/pagespeed?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Không kiểm tra được.");
        return;
      }
      setResult(data);
    } catch {
      setError("Không thể kết nối tới PageSpeed Insights.");
    } finally {
      setLoading(false);
    }
  }

  const scoreColor = result ? (result.score >= 90 ? "#1f6b1f" : result.score >= 50 ? "#8a6100" : "#a83232") : undefined;

  return (
    <div className="admin-panel" style={{ marginBottom: 20 }}>
      <h3 style={{ marginTop: 0 }}>Kiểm tra tốc độ trang (PageSpeed Insights)</h3>
      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} style={{ flex: 1 }} />
        <button className="btn btn-primary btn-sm" type="button" onClick={handleCheck} disabled={loading}>
          {loading ? "Đang kiểm tra..." : "Kiểm tra"}
        </button>
      </div>
      {error && <p style={{ color: "#a83232" }}>{error}</p>}
      {result && (
        <div style={{ display: "flex", gap: 30, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: scoreColor }}>{result.score}</div>
            <span style={{ color: "var(--a-ink-soft)", fontSize: ".8rem" }}>Điểm hiệu năng (mobile)</span>
          </div>
          <div>
            <div style={{ fontWeight: 700 }}>{result.lcp}</div>
            <span style={{ color: "var(--a-ink-soft)", fontSize: ".8rem" }}>LCP (tốc độ hiển thị nội dung chính)</span>
          </div>
          <div>
            <div style={{ fontWeight: 700 }}>{result.cls}</div>
            <span style={{ color: "var(--a-ink-soft)", fontSize: ".8rem" }}>CLS (độ ổn định bố cục)</span>
          </div>
          <div>
            <div style={{ fontWeight: 700 }}>{result.inp}</div>
            <span style={{ color: "var(--a-ink-soft)", fontSize: ".8rem" }}>INP (tốc độ phản hồi tương tác)</span>
          </div>
        </div>
      )}
    </div>
  );
}
