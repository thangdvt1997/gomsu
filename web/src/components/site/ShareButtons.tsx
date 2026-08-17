"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";

export function ShareButtons({ url, title, locale = "vi" }: { url: string; title: string; locale?: Locale }) {
  const isEn = locale === "en";
  const [copied, setCopied] = useState(false);

  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt(isEn ? "Copy link:" : "Sao chép đường dẫn:", url);
    }
  };

  return (
    <div className="share-row">
      <span className="share-label">{isEn ? "Share:" : "Chia sẻ:"}</span>
      <a
        className="share-btn"
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={isEn ? `Share "${title}" on Facebook` : `Chia sẻ "${title}" lên Facebook`}
      >
        Facebook
      </a>
      <button type="button" className="share-btn" onClick={copyLink}>
        {copied ? (isEn ? "Copied!" : "Đã sao chép!") : isEn ? "Copy Link" : "Sao chép liên kết"}
      </button>
    </div>
  );
}
