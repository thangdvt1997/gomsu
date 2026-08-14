"use client";

import { useState } from "react";

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Sao chép đường dẫn:", url);
    }
  };

  return (
    <div className="share-row">
      <span className="share-label">Chia sẻ:</span>
      <a className="share-btn" href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label={`Chia sẻ "${title}" lên Facebook`}>
        Facebook
      </a>
      <button type="button" className="share-btn" onClick={copyLink}>
        {copied ? "Đã sao chép!" : "Sao chép liên kết"}
      </button>
    </div>
  );
}
