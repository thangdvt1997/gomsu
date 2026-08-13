# -*- coding: utf-8 -*-
"""Shared HTML layout helpers for the static site generator."""
from products_data import COMPANY

SITE_NAME = COMPANY["name"]
DOMAIN = COMPANY["domain"]


def fmt_price(v):
    if v is None:
        return "Liên hệ"
    return f"{v:,.0f}".replace(",", ".") + "đ"


def nav_links(active=""):
    items = [
        ("/", "Trang chủ", "home"),
        ("/san-pham.html", "Sản phẩm", "products"),
        ("/bao-gia.html", "Bảng giá sỉ", "price"),
        ("/gioi-thieu.html", "Giới thiệu", "about"),
        ("/tin-tuc.html", "Tin tức", "blog"),
        ("/lien-he.html", "Liên hệ", "contact"),
    ]
    out = []
    for href, label, key in items:
        cls = ' class="active"' if key == active else ""
        out.append(f'<a href="{href}"{cls}>{label}</a>')
    return "\n".join(out)


def mobile_nav(active=""):
    items = [
        ("/", "Trang chủ"),
        ("/san-pham.html", "Sản phẩm"),
        ("/bao-gia.html", "Bảng giá sỉ"),
        ("/gioi-thieu.html", "Giới thiệu"),
        ("/tin-tuc.html", "Tin tức"),
        ("/lien-he.html", "Liên hệ"),
    ]
    links = "\n".join(f'<a href="{href}">{label}</a>' for href, label in items)
    return f"""
<div class="mobile-nav">
  <div class="close-row"><button class="nav-toggle mn-close" aria-label="Đóng menu"><span></span></button></div>
  {links}
  <div class="mn-contact">
    <a class="btn btn-primary btn-block" href="tel:{COMPANY['phone1_tel']}">Gọi ngay {COMPANY['phone1']}</a>
  </div>
</div>"""


def header(active=""):
    return f"""
<a class="skip-link" href="#main">Bỏ qua tới nội dung</a>
<header class="site-header">
  <div class="container header-bar">
    <a class="brand" href="/">
      <span class="brand-mark">TM</span>
      <span class="brand-text"><b>{SITE_NAME}</b><span>Gốm sứ Bát Tràng</span></span>
    </a>
    <nav class="main-nav">{nav_links(active)}</nav>
    <div class="header-actions">
      <div class="header-phone"><small>Hotline đặt sỉ</small><b>{COMPANY['phone1']}</b></div>
      <a class="btn btn-primary btn-sm" href="/lien-he.html">Nhận báo giá</a>
      <button class="nav-toggle" aria-label="Mở menu"><span></span></button>
    </div>
  </div>
</header>
{mobile_nav(active)}"""


def footer():
    return f"""
<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <div class="brand" style="margin-bottom:16px;">
          <span class="brand-mark">TM</span>
          <span class="brand-text"><b style="color:#fff">{SITE_NAME}</b><span>Gốm sứ Bát Tràng</span></span>
        </div>
        <p>Xưởng sản xuất &amp; phân phối sỉ lọ hoa gốm sứ Bát Tràng — hơn 60 mẫu mã, giao hàng toàn quốc,
        nhận đặt theo yêu cầu số lượng lớn cho shop hoa, homestay, khách sạn, nhà hàng.</p>
        <div class="footer-social">
          <a href="tel:{COMPANY['phone1_tel']}" aria-label="Gọi điện">☎</a>
          <a href="https://zalo.me/{COMPANY['zalo']}" aria-label="Zalo">Z</a>
          <a href="/lien-he.html" aria-label="Email">✉</a>
        </div>
      </div>
      <div>
        <h4>Danh mục</h4>
        <ul>
          <li><a href="/san-pham.html?cat=mini-de-ban">Mini &amp; để bàn</a></li>
          <li><a href="/san-pham.html?cat=co-dien-men-loang">Cổ điển &amp; men loang</a></li>
          <li><a href="/san-pham.html?cat=dang-doc-la">Dáng độc lạ</a></li>
          <li><a href="/san-pham.html?cat=vua-va-lon">Vừa &amp; lớn</a></li>
          <li><a href="/san-pham.html?cat=bo-suu-tap">Bộ sưu tập</a></li>
          <li><a href="/san-pham.html?cat=cao-cap-trang-tri">Cao cấp &amp; trang trí</a></li>
        </ul>
      </div>
      <div>
        <h4>Công ty</h4>
        <ul>
          <li><a href="/gioi-thieu.html">Giới thiệu xưởng gốm</a></li>
          <li><a href="/bao-gia.html">Bảng giá sỉ 2026</a></li>
          <li><a href="/tin-tuc.html">Tin tức &amp; cẩm nang</a></li>
          <li><a href="/lien-he.html">Liên hệ đặt hàng</a></li>
        </ul>
      </div>
      <div>
        <h4>Liên hệ</h4>
        <ul>
          <li>{COMPANY['address']}</li>
          <li><a href="tel:{COMPANY['phone1_tel']}">{COMPANY['phone1']}</a> · <a href="tel:{COMPANY['phone2_tel']}">{COMPANY['phone2']}</a></li>
          <li><a href="mailto:{COMPANY['email']}">{COMPANY['email']}</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 {SITE_NAME}. Sản xuất tại làng nghề Bát Tràng, Gia Lâm, Hà Nội.</span>
      <span><a href="/lien-he.html">Chính sách bán buôn</a> · <a href="/lien-he.html">Vận chuyển &amp; đổi trả</a></span>
    </div>
  </div>
</footer>
<div class="float-actions">
  <a class="float-btn zalo" href="https://zalo.me/{COMPANY['zalo']}" target="_blank" rel="noopener" aria-label="Chat Zalo" title="Chat Zalo">
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M4 4h16v12H8l-4 4V4Z" stroke="white" stroke-width="1.6" stroke-linejoin="round"/></svg>
  </a>
  <a class="float-btn phone" href="tel:{COMPANY['phone1_tel']}" aria-label="Gọi ngay" title="Gọi ngay">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2C9.4 21 3 14.6 3 6a2 2 0 0 1 2-2Z" stroke="white" stroke-width="1.6" stroke-linejoin="round"/></svg>
  </a>
</div>
<div class="lightbox"><button class="lightbox-close" aria-label="Đóng">✕</button><img src="" alt=""></div>
<script src="/assets/js/main.js"></script>"""


def page(title, description, path, body, og_image=None, extra_head="", body_class="", schema=""):
    canonical = f"{DOMAIN}{path}"
    img = og_image or f"{DOMAIN}/assets/img/site/lifestyle-1.jpg"
    return f"""<!doctype html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{description}">
<link rel="canonical" href="{canonical}">
<meta property="og:type" content="website">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{description}">
<meta property="og:image" content="{img}">
<meta property="og:url" content="{canonical}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=50 cy=50 r=48 fill=%22%23B5602F%22/><text x=50 y=64 font-size=44 fill=%22white%22 text-anchor=%22middle%22 font-family=%22Georgia,serif%22>T</text></svg>">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/style.css">
{extra_head}
{schema}
</head>
<body class="{body_class}">
{header(body_class)}
<main id="main">
{body}
</main>
{footer()}
</body>
</html>"""
