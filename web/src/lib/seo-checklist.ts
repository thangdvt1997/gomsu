export const SEO_CHECKLIST_ITEMS = [
  {
    key: "broken_links",
    label: "Kiểm tra liên kết gãy (nội bộ & ra ngoài)",
    hint: "Dạo qua vài trang sản phẩm/bài viết, bấm thử các liên kết xem có trang nào lỗi 404 không.",
  },
  {
    key: "core_web_vitals",
    label: "Kiểm tra tốc độ tải trang (Core Web Vitals)",
    hint: "Dùng nút \"Kiểm tra tốc độ\" bên dưới cho trang chủ và 1-2 trang sản phẩm phổ biến.",
  },
  {
    key: "new_content",
    label: "Đã đăng nội dung mới trong tuần chưa?",
    hint: "Google ưu tiên các site có nội dung cập nhật đều — thêm sản phẩm mới hoặc viết bài blog.",
  },
  {
    key: "alt_text",
    label: "Ảnh sản phẩm/bài viết mới có mô tả alt đầy đủ chưa",
    hint: "Widget \"Điểm SEO nhanh\" khi soạn bài viết đã tự kiểm tra phần này.",
  },
  {
    key: "gsc_coverage",
    label: "Kiểm tra lỗi index trên Google Search Console",
    hint: "Vào Search Console → Coverage/Indexing, xem có trang nào bị loại khỏi chỉ mục không.",
  },
] as const;

export type SeoChecklistState = Record<string, string>;

export const SEO_CHECKLIST_SETTING_KEY = "seo_checklist_state";
export const SEO_CHECKLIST_STALE_DAYS = 7;
