import { COMPANY } from "@/lib/site-config";

export function FloatActions() {
  return (
    <div className="float-actions">
      <a
        className="float-btn zalo"
        href={`https://zalo.me/${COMPANY.zalo}`}
        target="_blank"
        rel="noopener"
        aria-label="Chat Zalo"
        title="Chat Zalo"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 4h16v12H8l-4 4V4Z"
            stroke="white"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      </a>
      <a className="float-btn phone" href={`tel:${COMPANY.phone1Tel}`} aria-label="Gọi ngay" title="Gọi ngay">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2C9.4 21 3 14.6 3 6a2 2 0 0 1 2-2Z"
            stroke="white"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </div>
  );
}

export function Lightbox() {
  return (
    <div className="lightbox">
      <button className="lightbox-close" aria-label="Đóng">
        ✕
      </button>
      <img src="" alt="" />
    </div>
  );
}
