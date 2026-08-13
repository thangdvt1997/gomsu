# -*- coding: utf-8 -*-
"""
Static site generator for Gom Su Trung Mung.
Run from repo root:  python site/tools/generate_site.py
Reads product data + processed images, writes plain HTML into site/.
"""
import os
import sys
import html as _html

sys.path.insert(0, os.path.dirname(__file__))
from products_data import (
    COMPANY, GLAZE, CATEGORIES, CAT_LABEL, PRODUCTS, PRODUCTS_BY_SLUG, FEATURED, SIMILAR_TO,
)
from image_map import PRODUCT_IMAGES, WATERMARKED_EXCLUDE, LIFESTYLE_IMAGES, WORKSHOP_IMAGES
from layout import page, fmt_price, DOMAIN, SITE_NAME

OUT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))


def w(path, content):
    full = os.path.join(OUT, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8") as fh:
        fh.write(content)


def esc(s):
    return _html.escape(s, quote=True)


def image_count(slug):
    files = PRODUCT_IMAGES.get(slug, [])
    return len([f for f in files if f not in WATERMARKED_EXCLUDE])


def resolve_image_slug(slug):
    """Return (slug_to_load_images_from, is_similar) — falls back to a
    same-family sibling (SIMILAR_TO) when this product has no photo of its
    own, so the page shows a real photo with an honest badge instead of a
    bare placeholder."""
    if image_count(slug) > 0:
        return slug, False
    sib = SIMILAR_TO.get(slug)
    if sib and image_count(sib) > 0:
        return sib, True
    return slug, False


def min_price(p):
    prices = [s["price"] for s in p["sizes"] if s["price"] is not None]
    return min(prices) if prices else None


def price_display(p):
    prices = [s["price"] for s in p["sizes"] if s["price"] is not None]
    if not prices:
        return "Liên hệ"
    lo = min(prices)
    if len(p["sizes"]) > 1 and len(set(prices)) > 1:
        return f"Từ {fmt_price(lo)}"
    return fmt_price(lo)


def dims_display(p):
    s = p["sizes"][0]
    bits = []
    if s["h"]:
        bits.append(f"Cao {s['h']}cm")
    if s["m"]:
        bits.append(f"Miệng {s['m']}cm")
    if len(p["sizes"]) > 1:
        bits.append(f"{len(p['sizes'])} kích cỡ")
    return " · ".join(bits) if bits else f"{len(p['sizes'])} kích cỡ"


VASE_SVG = """<svg viewBox="0 0 120 160" width="46%" style="opacity:.5">
<path d="M45 8h30l4 22c14 10 21 26 21 46 0 40-22 68-40 68s-40-28-40-68c0-20 7-36 21-46l4-22Z"
fill="none" stroke="currentColor" stroke-width="3"/>
<path d="M42 30h36" stroke="currentColor" stroke-width="3"/>
</svg>"""


def placeholder_tile(p, big=False):
    h = "260px" if big else "100%"
    return f"""<div style="width:100%;height:{h};display:flex;flex-direction:column;align-items:center;
justify-content:center;background:linear-gradient(150deg,var(--clay-200),var(--clay-100));color:var(--terracotta-dark);
gap:8px;text-align:center;padding:12px;">
{VASE_SVG}
<b style="font-family:'Playfair Display',serif;font-size:.95rem;color:var(--ink-soft)">{esc(p['name'])}</b>
</div>"""


def product_thumb_html(p, size="card"):
    """Return an <img> tag or placeholder markup for grid/card contexts."""
    src_slug, is_similar = resolve_image_slug(p["slug"])
    if image_count(src_slug) > 0:
        src = f"/assets/img/products/{src_slug}-1-thumb.jpg"
        img = f'<img src="{src}" alt="{esc(p["name"])} - {esc(COMPANY["name"])} Bát Tràng" loading="lazy" width="700" height="700">'
        if is_similar:
            return img + ('<span class="badge-new" style="background:var(--ink-faint);'
                          'top:auto;right:auto;bottom:12px;left:12px;">Ảnh minh hoạ</span>')
        return img
    return placeholder_tile(p)


def color_dots(p, limit=4):
    dots = "".join(
        f'<span class="sw" style="background:{GLAZE[c][1]}" title="{esc(GLAZE[c][0])}"></span>'
        for c in p["colors"][:limit]
    )
    return f'<div class="swatches">{dots}</div>'


def product_card(p, order=0):
    href = f"/san-pham/{p['slug']}.html"
    badge = '<span class="badge-new">Nổi bật</span>' if p["featured"] and order < 8 else ""
    colors_attr = ",".join(p["colors"])
    return f"""<article class="product-card" data-name="{esc(p['name'])}" data-code="{p['code']}"
data-cat="{p['cat']}" data-colors="{colors_attr}" data-price="{min_price(p) or 0}" data-order="{order}">
  <a class="thumb" href="{href}" style="display:block;">
    {product_thumb_html(p)}
    <span class="code">{p['code']}</span>
    {badge}
  </a>
  <div class="body">
    <span class="cat">{esc(CAT_LABEL[p['cat']])}</span>
    <h3><a href="{href}">{esc(p['name'])}</a></h3>
    <div class="dims">{dims_display(p)}</div>
    <div class="price-row">
      <span class="price">{price_display(p)}</span>
      {color_dots(p)}
    </div>
  </div>
</article>"""


# --------------------------------------------------------------------------
# HOME PAGE
# --------------------------------------------------------------------------
def build_home():
    hero_slugs = ["chum-2-tai", "bau-tron", "lo-tulip", "lo-ho-lo"]
    slides = []
    dots = []
    for i, slug in enumerate(hero_slugs):
        src = f"/assets/img/products/{slug}-1.jpg"
        slides.append(f'<div class="hero-slide{" is-active" if i == 0 else ""}" style="background-image:url(\'{src}\')"></div>')
        dots.append(f'<button class="{"is-active" if i == 0 else ""}" aria-label="Ảnh {i+1}"></button>')

    featured_cards = "\n".join(product_card(p, i) for i, p in enumerate(FEATURED[:8]))

    cat_chips = "\n".join(
        f'<a class="chip" href="/san-pham.html?cat={key}">{esc(label)}</a>' for key, label in CATEGORIES
    )

    lifestyle_imgs = [f"/assets/img/site/lifestyle-{i}.jpg" for i in range(1, 7)]
    gallery_html = "\n".join(
        f'<img src="{img}" data-lightbox="{img.replace("-thumb","")}" alt="Không gian trang trí lọ hoa gốm sứ Bát Tràng {i+1}" loading="lazy">'
        if False else f'<img class="{"tall" if i in (0,3) else ""}" src="{img}" alt="Không gian trang trí gốm sứ Bát Tràng {i+1}" loading="lazy">'
        for i, img in enumerate(lifestyle_imgs)
    )

    body = f"""
<section class="hero">
  <div class="hero-slides">{''.join(slides)}</div>
  <div class="container hero-content">
    <span class="eyebrow">Xưởng gốm Bát Tràng · {COMPANY['founded']} kinh nghiệm</span>
    <h1>Lọ Hoa Gốm Sứ Bát Tràng — Đẹp Từ Nét Vẽ Đến Từng Đường Men</h1>
    <p class="lead">{SITE_NAME} sản xuất &amp; phân phối sỉ hơn 60 mẫu lọ hoa gốm sứ thủ công, đủ kích cỡ
    từ để bàn tới trang trí sảnh lớn. Đặt sỉ số lượng lớn, giao hàng toàn quốc, hỗ trợ mẫu riêng theo yêu cầu.</p>
    <div class="hero-cta">
      <a class="btn btn-primary" href="/san-pham.html">Xem toàn bộ sản phẩm</a>
      <a class="btn btn-ghost" href="/lien-he.html">Nhận báo giá sỉ</a>
    </div>
    <div class="hero-stats">
      <div><b>60+</b><span>mẫu lọ hoa</span></div>
      <div><b>20+</b><span>năm làm nghề</span></div>
      <div><b>13+</b><span>tông men đặc trưng</span></div>
      <div><b>63</b><span>tỉnh thành giao hàng</span></div>
    </div>
  </div>
  <div class="hero-dots">{''.join(dots)}</div>
</section>

<section class="section-tight">
  <div class="container">
    <div class="chip-row" data-reveal>{cat_chips}</div>
  </div>
</section>

<section class="bg-alt">
  <div class="container">
    <div class="value-grid">
      <div class="value-card" data-reveal>
        <div class="ic">🏺</div>
        <h3>Xưởng sản xuất trực tiếp</h3>
        <p>Không qua trung gian — giá gốc tại lò Bát Tràng, chủ động sản lượng và tiến độ giao hàng.</p>
      </div>
      <div class="value-card" data-reveal>
        <div class="ic">🎨</div>
        <h3>60+ mẫu, 13 tông men</h3>
        <p>Từ men mát, men sôi tới men khô — luôn có mẫu và màu phù hợp phong cách cửa hàng của bạn.</p>
      </div>
      <div class="value-card" data-reveal>
        <div class="ic">📦</div>
        <h3>Đóng gói chống vỡ</h3>
        <p>Quy trình đóng gói riêng cho gốm sứ, an tâm vận chuyển đường dài toàn quốc.</p>
      </div>
      <div class="value-card" data-reveal>
        <div class="ic">🤝</div>
        <h3>Nhận đặt mẫu riêng</h3>
        <p>Tuỳ chỉnh kích thước, màu men theo yêu cầu cho đơn sỉ số lượng lớn.</p>
      </div>
    </div>
  </div>
</section>

<section>
  <div class="container">
    <div class="section-head" data-reveal>
      <span class="eyebrow">Bán chạy nhất</span>
      <h2>Sản Phẩm Nổi Bật</h2>
      <p>Những mẫu được đặt nhiều nhất trong bộ sưu tập lọ hoa gốm sứ Bát Tràng của xưởng.</p>
    </div>
    <div class="product-grid" data-reveal>{featured_cards}</div>
    <div class="text-center" style="margin-top:40px;">
      <a class="btn btn-outline" href="/san-pham.html">Xem tất cả 60+ mẫu</a>
    </div>
  </div>
</section>

<section class="bg-alt">
  <div class="container">
    <div class="section-head center" data-reveal>
      <span class="eyebrow">Không gian thực tế</span>
      <h2>Gốm Sứ Trong Từng Góc Sống</h2>
      <p>Một vài khoảnh khắc lọ hoa Bát Tràng được khách hàng bày trí trong không gian thật.</p>
    </div>
    <div class="about-gallery" data-reveal>{gallery_html}</div>
  </div>
</section>

<section>
  <div class="container">
    <div class="cta-band" data-reveal>
      <div>
        <h2>Cần báo giá sỉ số lượng lớn?</h2>
        <p>Gửi mẫu, số lượng và khu vực giao hàng — xưởng phản hồi báo giá trong vòng 30 phút làm việc.</p>
      </div>
      <div style="display:flex;gap:12px;flex-wrap:wrap;">
        <a class="btn btn-ghost" href="tel:{COMPANY['phone1_tel']}">Gọi {COMPANY['phone1']}</a>
        <a class="btn btn-outline" href="/lien-he.html">Gửi yêu cầu báo giá</a>
      </div>
    </div>
  </div>
</section>
"""
    w("index.html", page(
        title=f"{SITE_NAME} — Xưởng Lọ Hoa Gốm Sứ Bát Tràng | Sỉ &amp; Lẻ Toàn Quốc",
        description="Xưởng sản xuất lọ hoa gốm sứ Bát Tràng, hơn 60 mẫu mã đa dạng kích thước và men màu. "
                     "Bán sỉ giá gốc, nhận đặt mẫu riêng, giao hàng toàn quốc.",
        path="/",
        body=body,
        og_image=f"{DOMAIN}/assets/img/products/chum-2-tai-1.jpg",
        body_class="home",
    ))


# --------------------------------------------------------------------------
# CATALOG PAGE
# --------------------------------------------------------------------------
def build_catalog():
    cards = "\n".join(product_card(p, i) for i, p in enumerate(PRODUCTS))
    chips = ['<button class="chip is-active" data-catalog-chip="all">Tất cả (60)</button>']
    for key, label in CATEGORIES:
        n = len([p for p in PRODUCTS if p["cat"] == key])
        chips.append(f'<button class="chip" data-catalog-chip="{key}">{esc(label)} ({n})</button>')

    color_checks = "\n".join(
        f'<label><input type="checkbox" data-catalog-check="color" value="{k}"> '
        f'<span class="sw" style="display:inline-block;background:{v[1]}"></span> {esc(v[0])}</label>'
        for k, v in list(GLAZE.items())[:8]
    )

    body = f"""
<div class="page-hero">
  <img class="bg" src="/assets/img/products/chum-2-tai-2-thumb.jpg" alt="">
  <div class="container">
    <div class="breadcrumb"><a href="/">Trang chủ</a><span>/</span><span>Sản phẩm</span></div>
    <h1>Toàn Bộ Bộ Sưu Tập Lọ Hoa Gốm Sứ</h1>
    <p style="max-width:60ch;color:rgba(255,255,255,.82)">60 mẫu lọ hoa gốm sứ Bát Tràng — từ mini để bàn
    đến trang trí sảnh lớn, đầy đủ kích thước, men màu và mức giá sỉ.</p>
  </div>
</div>
<section class="section-tight">
  <div class="container catalog-layout">
    <aside class="filter-box">
      <div class="search-box">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><path d="m20 20-3.5-3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        <input type="search" placeholder="Tìm theo tên hoặc mã hàng..." data-catalog-search aria-label="Tìm sản phẩm">
      </div>
      <h4>Danh mục</h4>
      <div class="chip-row" style="flex-direction:column;align-items:flex-start;gap:8px;">{"".join(chips)}</div>
      <h4>Khoảng giá</h4>
      <div class="filter-list price-range">
        <label><input type="checkbox" data-catalog-check="price" value="under30"> Dưới 30.000đ</label>
        <label><input type="checkbox" data-catalog-check="price" value="30to60"> 30.000 – 60.000đ</label>
        <label><input type="checkbox" data-catalog-check="price" value="60to120"> 60.000 – 120.000đ</label>
        <label><input type="checkbox" data-catalog-check="price" value="over120"> Trên 120.000đ</label>
      </div>
      <h4>Tông men</h4>
      <div class="filter-list">{color_checks}</div>
    </aside>
    <div>
      <div class="toolbar">
        <span class="result-count"><b data-catalog-count>60</b> sản phẩm</span>
        <select class="sort-select" data-catalog-sort aria-label="Sắp xếp">
          <option value="default">Mặc định</option>
          <option value="price-asc">Giá tăng dần</option>
          <option value="price-desc">Giá giảm dần</option>
          <option value="name-asc">Tên A–Z</option>
        </select>
      </div>
      <div class="product-grid" data-catalog-grid>{cards}</div>
      <p class="empty-state" data-catalog-empty style="display:none;">Không tìm thấy sản phẩm phù hợp. Thử bỏ bớt bộ lọc hoặc gọi hotline để được tư vấn mẫu tương tự.</p>
    </div>
  </div>
</section>
"""
    w("san-pham.html", page(
        title="Sản Phẩm — Hơn 60 Mẫu Lọ Hoa Gốm Sứ Bát Tràng | " + SITE_NAME,
        description="Danh mục đầy đủ hơn 60 mẫu lọ hoa gốm sứ Bát Tràng: mini để bàn, cổ điển men loang, "
                     "dáng độc lạ, bộ sưu tập và dòng cao cấp trang trí. Lọc theo danh mục, giá, tông men.",
        path="/san-pham.html",
        body=body,
        body_class="products",
    ))


# --------------------------------------------------------------------------
# PRODUCT DETAIL PAGES
# --------------------------------------------------------------------------
def size_table_rows(p):
    rows = []
    for s in p["sizes"]:
        label = s["label"] or "Kích thước tiêu chuẩn"
        dims = " × ".join(filter(None, [f"Cao {s['h']}cm" if s["h"] else "", f"Miệng {s['m']}cm" if s["m"] else ""]))
        rows.append(f"""<div class="variant-pill" data-dims="{esc(dims)}" data-price="{fmt_price(s['price'])}">
{label}{' — ' + dims if dims else ''}</div>""")
    return "\n".join(rows)


def color_pills(p):
    out = []
    for c in p["colors"]:
        label, hexv = GLAZE[c]
        out.append(f'<div class="color-pill"><span class="color-dot" style="background:{hexv}"></span>{esc(label)}</div>')
    return "\n".join(out)


def related_products(p, n=4):
    same_cat = [x for x in PRODUCTS if x["cat"] == p["cat"] and x["slug"] != p["slug"]]
    return same_cat[:n] if same_cat else [x for x in PRODUCTS if x["slug"] != p["slug"]][:n]


def build_product_pages():
    for p in PRODUCTS:
        src_slug, is_similar = resolve_image_slug(p["slug"])
        n = image_count(src_slug)
        if n > 0:
            main_img = f"/assets/img/products/{src_slug}-1.jpg"
            thumbs = "\n".join(
                f"""<button data-full="/assets/img/products/{src_slug}-{i}.jpg" class="{'is-active' if i == 1 else ''}">
<img src="/assets/img/products/{src_slug}-{i}-thumb.jpg" alt="{esc(p['name'])} ảnh {i}" loading="lazy"></button>"""
                for i in range(1, n + 1)
            )
            similar_note = ""
            if is_similar:
                sib_name = PRODUCTS_BY_SLUG[src_slug]["name"]
                similar_note = f"""<p style="font-size:.82rem;color:var(--ink-faint);margin-top:12px;text-align:center;">
  <b style="color:var(--terracotta-dark);">Ảnh minh hoạ</b> — {p['name']} cùng dòng kiểu dáng/chất men với mẫu
  {esc(sib_name)} đã có ảnh thật; hình dáng {p['name']} có thể khác đôi chút. Nhắn Zalo để xem ảnh thực tế
  đúng mẫu {p['code']}.</p>"""
            gallery_html = f"""<div class="pd-gallery">
  <div class="pd-main-img"><img src="{main_img}" alt="{esc(p['name'])} - lọ hoa gốm sứ Bát Tràng {p['code']}" data-lightbox="{main_img}" id="pdmain"></div>
  <div class="pd-thumbs">{thumbs}</div>
  {similar_note}
</div>"""
            og_image = f"{DOMAIN}{main_img}"
        else:
            gallery_html = f"""<div class="pd-gallery">
  <div class="pd-main-img">{placeholder_tile(p, big=True)}</div>
  <p style="font-size:.82rem;color:var(--ink-faint);margin-top:12px;text-align:center;">
  Ảnh thực tế mẫu này đang được cập nhật — nhắn Zalo để xưởng gửi ảnh/video trực tiếp trong ngày.</p>
</div>"""
            og_image = f"{DOMAIN}/assets/img/site/lifestyle-1.jpg"

        rel = related_products(p)
        rel_cards = "\n".join(product_card(r) for r in rel)

        lo_price = min_price(p)
        schema = f"""<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "{esc(p['name'])} - {esc(SITE_NAME)}",
  "sku": "{p['code']}",
  "description": "{esc(p['tag'])}",
  "brand": {{"@type": "Brand", "name": "{esc(SITE_NAME)}"}},
  "offers": {{
    "@type": "Offer",
    "priceCurrency": "VND",
    "price": "{lo_price or 0}",
    "availability": "https://schema.org/InStock",
    "url": "{DOMAIN}/san-pham/{p['slug']}.html"
  }}
}}
</script>"""

        body = f"""
<div class="container" style="padding-top:calc(var(--header-h) + 26px);">
  <div class="breadcrumb" style="color:var(--ink-faint)">
    <a href="/">Trang chủ</a><span>/</span><a href="/san-pham.html">Sản phẩm</a><span>/</span>
    <a href="/san-pham.html?cat={p['cat']}">{esc(CAT_LABEL[p['cat']])}</a><span>/</span><span>{esc(p['name'])}</span>
  </div>
  <div class="pd-layout">
    {gallery_html}
    <div class="pd-info">
      <div class="code-line"><span class="code">{p['code']}</span><span class="stars">★★★★★</span></div>
      <h1>{esc(p['name'])}</h1>
      <p class="sub">{esc(p['tag'])}</p>
      <div class="pd-price" data-pd-price>{price_display(p)}</div>
      <p class="pd-price-note">Giá bán sỉ, đã bao gồm men màu tiêu chuẩn · Đơn lẻ vui lòng liên hệ</p>

      <div class="variant-group">
        <h4>Kích thước</h4>
        <div class="variant-options">{size_table_rows(p)}</div>
      </div>
      <div class="variant-group">
        <h4>Tông men có sẵn</h4>
        <div class="color-options">{color_pills(p)}</div>
      </div>

      <div class="qty-row">
        <div class="qty-stepper">
          <button class="qty-minus" aria-label="Giảm số lượng">−</button>
          <input type="text" value="50" inputmode="numeric" aria-label="Số lượng đặt">
          <button class="qty-plus" aria-label="Tăng số lượng">+</button>
        </div>
        <span style="font-size:.82rem;color:var(--ink-faint)">Số lượng tối thiểu tham khảo cho đơn sỉ</span>
      </div>

      <div class="pd-cta">
        <a class="btn btn-primary" href="https://zalo.me/{COMPANY['zalo']}" target="_blank" rel="noopener">Đặt hàng qua Zalo</a>
        <a class="btn btn-outline" href="tel:{COMPANY['phone1_tel']}">Gọi tư vấn {COMPANY['phone1']}</a>
      </div>

      <table class="pd-meta-table">
        <tr><td>Mã hàng</td><td>{p['code']}</td></tr>
        <tr><td>Chất liệu</td><td>Gốm sứ Bát Tràng, nung ở nhiệt độ cao</td></tr>
        <tr><td>Kích thước</td><td data-pd-dims>{dims_display(p)}</td></tr>
        <tr><td>Xuất xứ</td><td>Làng gốm Bát Tràng, Gia Lâm, Hà Nội</td></tr>
        <tr><td>Đóng gói</td><td>Chèn xốp/giấy chống sốc, thùng carton chuyên dụng cho gốm sứ</td></tr>
      </table>

      <div class="trust-row">
        <div>✓ Hàng có sẵn tại xưởng</div>
        <div>✓ Hỗ trợ đổi hàng vỡ vận chuyển</div>
        <div>✓ Xuất hoá đơn theo yêu cầu</div>
      </div>
    </div>
  </div>

  <div class="tabs" data-panels="#pd-panels">
    <button class="tab-btn is-active" data-tab="mota">Mô tả chi tiết</button>
    <button class="tab-btn" data-tab="thongso">Thông số kỹ thuật</button>
    <button class="tab-btn" data-tab="baoquan">Bảo quản &amp; vệ sinh</button>
  </div>
  <div id="pd-panels">
    <div class="tab-panel is-active" data-panel="mota">
      <div class="article-body" style="margin:0;max-width:none;">
        {"".join(f"<p>{esc(par)}</p>" for par in p["desc"].split("\n\n"))}
      </div>
    </div>
    <div class="tab-panel" data-panel="thongso">
      <div class="spec-list">
        <div><span>Mã hàng</span><span>{p['code']}</span></div>
        <div><span>Danh mục</span><span>{esc(CAT_LABEL[p['cat']])}</span></div>
        <div><span>Số kích thước</span><span>{len(p['sizes'])}</span></div>
        <div><span>Chất liệu</span><span>Gốm sứ cao cấp Bát Tràng</span></div>
        <div><span>Kỹ thuật</span><span>Vuốt tay / đổ khuôn, nung ~1200°C</span></div>
        <div><span>Ứng dụng</span><span>Trang trí nội thất, cắm hoa tươi/hoa khô, quà tặng</span></div>
      </div>
    </div>
    <div class="tab-panel" data-panel="baoquan">
      <div class="article-body" style="margin:0;max-width:none;">
        <p>Lau nhẹ bằng khăn ẩm, tránh dùng vật sắc nhọn cọ xát trực tiếp lên bề mặt men để giữ độ bóng lâu dài.
        Nếu cắm hoa tươi, nên thay nước 2–3 ngày/lần và vệ sinh khô ráo trước khi cất trữ để tránh ố cặn bên trong lòng lọ.
        Đặt ở nơi chắc chắn, tránh va đập mạnh; với các mẫu cỡ lớn nên có đế lót chống trượt khi đặt trên mặt sàn bóng.</p>
      </div>
    </div>
  </div>

  <hr class="divider">
  <div class="section-head" data-reveal>
    <span class="eyebrow">Có thể bạn cũng thích</span>
    <h2>Sản Phẩm Cùng Danh Mục</h2>
  </div>
  <div class="related-scroll">{rel_cards}</div>
</div>
"""
        w(f"san-pham/{p['slug']}.html", page(
            title=f"{p['name']} {p['code']} — Lọ Hoa Gốm Sứ Bát Tràng | {SITE_NAME}",
            description=f"{p['tag']}. {dims_display(p)}, giá sỉ {price_display(p).lower()}. "
                        f"Hàng có sẵn tại xưởng gốm Bát Tràng, giao toàn quốc.",
            path=f"/san-pham/{p['slug']}.html",
            body=body,
            og_image=og_image,
            schema=schema,
            body_class="products",
        ))


# --------------------------------------------------------------------------
# WHOLESALE PRICE LIST PAGE
# --------------------------------------------------------------------------
def build_price_list():
    rows = []
    for p in PRODUCTS:
        src_slug, _ = resolve_image_slug(p["slug"])
        thumb_cell = (
            f'<img src="/assets/img/products/{src_slug}-1-thumb.jpg" alt="{esc(p["name"])}" loading="lazy">'
            if image_count(src_slug) > 0 else '<span style="font-size:1.4rem;">🏺</span>'
        )
        size_lines = []
        for s in p["sizes"]:
            label = (s["label"] + ": ") if s["label"] else ""
            dims = " / ".join(filter(None, [f"C{s['h']}" if s['h'] else "", f"M{s['m']}" if s['m'] else ""]))
            prefix = f"{label}{dims} — " if dims else label
            size_lines.append(f"{prefix}<b class='pprice'>{fmt_price(s['price'])}</b>")
        rows.append(f"""<tr>
<td>{thumb_cell}</td>
<td><a class="pname" href="/san-pham/{p['slug']}.html">{esc(p['name'])}</a><br><span style="color:var(--ink-faint);font-size:.78rem">{p['code']}</span></td>
<td>{esc(CAT_LABEL[p['cat']])}</td>
<td>{"<br>".join(size_lines)}</td>
<td><a class="btn btn-sm btn-outline" href="/san-pham/{p['slug']}.html">Xem</a></td>
</tr>""")

    body = f"""
<div class="page-hero">
  <img class="bg" src="/assets/img/site/workshop-3-thumb.jpg" alt="">
  <div class="container">
    <div class="breadcrumb"><a href="/">Trang chủ</a><span>/</span><span>Bảng giá sỉ</span></div>
    <h1>Bảng Giá Sỉ Lọ Hoa Gốm Sứ 2026</h1>
    <p style="max-width:64ch;color:rgba(255,255,255,.82)">Cập nhật từ bảng giá xưởng {SITE_NAME} —
    {COMPANY['address']}. Giá áp dụng cho đơn đặt sỉ, số lượng lớn vui lòng liên hệ để nhận chiết khấu thêm.</p>
  </div>
</div>
<section class="section-tight">
  <div class="container">
    <div class="price-table-wrap">
      <table class="price-table">
        <thead><tr><th>Ảnh</th><th>Sản phẩm</th><th>Danh mục</th><th>Kích thước / Giá</th><th></th></tr></thead>
        <tbody>{"".join(rows)}</tbody>
      </table>
    </div>
    <div class="cta-band" style="margin-top:50px;" data-reveal>
      <div>
        <h2>Cần bảng giá dạng file để gửi đối tác?</h2>
        <p>Liên hệ Zalo/hotline để nhận file báo giá PDF đầy đủ kèm ảnh thực tế và chính sách chiết khấu theo số lượng.</p>
      </div>
      <div style="display:flex;gap:12px;flex-wrap:wrap;">
        <a class="btn btn-ghost" href="https://zalo.me/{COMPANY['zalo']}" target="_blank" rel="noopener">Nhắn Zalo</a>
        <a class="btn btn-outline" href="tel:{COMPANY['phone1_tel']}">Gọi {COMPANY['phone1']}</a>
      </div>
    </div>
  </div>
</section>
"""
    w("bao-gia.html", page(
        title="Bảng Giá Sỉ Lọ Hoa Gốm Sứ Bát Tràng 2026 | " + SITE_NAME,
        description="Bảng giá sỉ đầy đủ hơn 60 mẫu lọ hoa gốm sứ Bát Tràng năm 2026: kích thước, mã hàng, "
                     "giá bán theo từng size. Liên hệ để nhận chiết khấu số lượng lớn.",
        path="/bao-gia.html",
        body=body,
        body_class="price",
    ))


# --------------------------------------------------------------------------
# ABOUT PAGE
# --------------------------------------------------------------------------
def build_about():
    gallery = "\n".join(
        f'<img class="{"tall" if i == 0 else ""}" src="/assets/img/site/workshop-{i+1}.jpg" alt="Xưởng gốm {SITE_NAME} tại Bát Tràng {i+1}" loading="lazy">'
        for i in range(min(7, len(WORKSHOP_IMAGES)))
    )
    body = f"""
<div class="page-hero">
  <img class="bg" src="/assets/img/site/workshop-1-thumb.jpg" alt="">
  <div class="container">
    <div class="breadcrumb"><a href="/">Trang chủ</a><span>/</span><span>Giới thiệu</span></div>
    <h1>Giữ Lửa Nghề Gốm Bát Tràng</h1>
    <p style="max-width:60ch;color:rgba(255,255,255,.82)">Từ đất sét sông Hồng đến những chiếc lọ hoa
    có mặt trong hàng ngàn ngôi nhà, quán cà phê và không gian sự kiện khắp Việt Nam.</p>
  </div>
</div>
<section>
  <div class="container grid-2" style="align-items:center;">
    <div data-reveal>
      <span class="eyebrow">Câu chuyện của chúng tôi</span>
      <h2>{SITE_NAME} — Xưởng Sản Xuất Lọ Hoa Thủ Công Tại Giang Cao, Bát Tràng</h2>
      <p>Toạ lạc tại thôn Giang Cao — trái tim của làng gốm Bát Tràng, xưởng {SITE_NAME} chuyên sản xuất
      lọ hoa gốm sứ với hơn 60 kiểu dáng, từ mẫu mini để bàn đến các thiết kế cỡ lớn cho không gian sảnh,
      khách sạn. Mỗi sản phẩm đều trải qua quy trình vuốt tay hoặc đổ khuôn, phơi khô tự nhiên, tráng men
      và nung ở nhiệt độ cao để đảm bảo độ bền và màu men chuẩn.</p>
      <p>Chúng tôi phục vụ cả khách lẻ yêu gốm lẫn đối tác sỉ: shop hoa tươi, chuỗi cà phê, homestay,
      khách sạn và các đơn vị tổ chức sự kiện trên toàn quốc — với cam kết giá tốt tận xưởng, đóng gói cẩn
      thận và hỗ trợ phát triển mẫu riêng theo yêu cầu.</p>
    </div>
    <div><img src="/assets/img/site/workshop-2.jpg" alt="Nghệ nhân làm gốm tại xưởng {SITE_NAME}" style="border-radius:var(--radius-l);box-shadow:var(--shadow-m)"></div>
  </div>
</section>
<section class="bg-alt">
  <div class="container">
    <div class="section-head center" data-reveal>
      <span class="eyebrow">Quy trình</span>
      <h2>Từ Đất Sét Đến Sản Phẩm Hoàn Thiện</h2>
    </div>
    <div class="timeline" data-reveal>
      <div class="step"><div class="num">01</div><h3>Tạo hình</h3><p>Vuốt tay trên bàn xoay hoặc đổ khuôn tuỳ theo kiểu dáng, đảm bảo tỉ lệ chuẩn từng chi tiết.</p></div>
      <div class="step"><div class="num">02</div><h3>Phơi &amp; sửa nguội</h3><p>Phôi gốm được phơi khô tự nhiên, chỉnh sửa bề mặt trước khi vào lò nung sơ.</p></div>
      <div class="step"><div class="num">03</div><h3>Tráng men</h3><p>Phủ men theo tông màu đặt hàng — men mát, men sôi hoặc men khô tạo hiệu ứng riêng.</p></div>
      <div class="step"><div class="num">04</div><h3>Nung &amp; kiểm tra</h3><p>Nung ở nhiệt độ cao, kiểm tra kỹ từng sản phẩm trước khi đóng gói xuất xưởng.</p></div>
    </div>
  </div>
</section>
<section>
  <div class="container">
    <div class="section-head center" data-reveal>
      <span class="eyebrow">Góc xưởng</span>
      <h2>Một Ngày Tại Xưởng Gốm</h2>
    </div>
    <div class="about-gallery" data-reveal>{gallery}</div>
  </div>
</section>
<section class="bg-alt">
  <div class="container">
    <div class="cta-band" data-reveal>
      <div><h2>Ghé thăm xưởng tại Bát Tràng</h2><p>{COMPANY['address']} — hoan nghênh đối tác đến tham quan xưởng và chọn mẫu trực tiếp.</p></div>
      <a class="btn btn-ghost" href="/lien-he.html">Xem chỉ đường</a>
    </div>
  </div>
</section>
"""
    w("gioi-thieu.html", page(
        title=f"Giới Thiệu Xưởng Gốm {SITE_NAME} Tại Bát Tràng",
        description=f"Câu chuyện, quy trình sản xuất và địa chỉ xưởng gốm {SITE_NAME} tại làng nghề Bát "
                     f"Tràng, Gia Lâm, Hà Nội — chuyên sản xuất lọ hoa gốm sứ thủ công.",
        path="/gioi-thieu.html",
        body=body,
        body_class="about",
    ))


# --------------------------------------------------------------------------
# CONTACT PAGE
# --------------------------------------------------------------------------
def build_contact():
    map_q = COMPANY["map_query"].replace(" ", "+")
    body = f"""
<div class="page-hero">
  <img class="bg" src="/assets/img/site/lifestyle-2-thumb.jpg" alt="">
  <div class="container">
    <div class="breadcrumb"><a href="/">Trang chủ</a><span>/</span><span>Liên hệ</span></div>
    <h1>Liên Hệ Đặt Hàng</h1>
    <p style="max-width:60ch;color:rgba(255,255,255,.82)">Để lại thông tin hoặc liên hệ trực tiếp — xưởng
    phản hồi báo giá trong vòng 30 phút làm việc.</p>
  </div>
</div>
<section>
  <div class="container contact-layout">
    <div data-reveal>
      <h2 style="font-size:1.5rem;">Thông tin xưởng</h2>
      <div class="info-card">
        <div class="ic">📍</div>
        <div><h4>Địa chỉ xưởng</h4><p>{COMPANY['address']}</p></div>
      </div>
      <div class="info-card">
        <div class="ic">📞</div>
        <div><h4>Hotline đặt sỉ</h4><p><a href="tel:{COMPANY['phone1_tel']}">{COMPANY['phone1']}</a> — <a href="tel:{COMPANY['phone2_tel']}">{COMPANY['phone2']}</a></p></div>
      </div>
      <div class="info-card">
        <div class="ic">💬</div>
        <div><h4>Zalo / Messenger</h4><p>Nhắn tin để gửi ảnh mẫu &amp; nhận báo giá nhanh nhất.</p></div>
      </div>
      <div class="info-card">
        <div class="ic">✉</div>
        <div><h4>Email</h4><p><a href="mailto:{COMPANY['email']}">{COMPANY['email']}</a></p></div>
      </div>
      <div class="info-card">
        <div class="ic">🕐</div>
        <div><h4>Giờ làm việc</h4><p>7:30 – 18:00 tất cả các ngày trong tuần, kể cả cuối tuần</p></div>
      </div>
      <div class="map-frame">
        <iframe src="https://www.google.com/maps?q={map_q}&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Bản đồ xưởng gốm {SITE_NAME}"></iframe>
      </div>
    </div>
    <div data-reveal>
      <h2 style="font-size:1.5rem;">Gửi yêu cầu báo giá</h2>
      <p style="color:var(--ink-soft)">Điền thông tin bên dưới, chúng tôi sẽ liên hệ lại qua số điện thoại bạn để lại.</p>
      <form class="form-grid" onsubmit="return false;">
        <div class="field"><label>Họ và tên *</label><input type="text" required placeholder="Nguyễn Văn A"></div>
        <div class="field"><label>Số điện thoại *</label><input type="tel" required placeholder="09xxxxxxxx"></div>
        <div class="field full"><label>Email</label><input type="email" placeholder="ban@congty.vn"></div>
        <div class="field full">
          <label>Bạn quan tâm mẫu nào?</label>
          <select><option>Chưa xác định — tư vấn giúp tôi</option><option>Mini &amp; để bàn</option>
          <option>Cổ điển &amp; men loang</option><option>Dáng độc lạ</option><option>Vừa &amp; lớn</option>
          <option>Bộ sưu tập</option><option>Cao cấp &amp; trang trí</option></select>
        </div>
        <div class="field full"><label>Số lượng dự kiến</label><input type="text" placeholder="VD: 200 chiếc / tháng"></div>
        <div class="field full"><label>Ghi chú</label><textarea placeholder="Mẫu mã, màu men, thời gian cần giao..."></textarea></div>
        <div class="field full">
          <button class="btn btn-primary btn-block" type="submit">Gửi yêu cầu báo giá</button>
          <p style="font-size:.78rem;color:var(--ink-faint);margin-top:10px;">
          Để được phản hồi nhanh nhất, vui lòng nhắn trực tiếp qua
          <a href="https://zalo.me/{COMPANY['zalo']}" target="_blank" rel="noopener" style="color:var(--terracotta-dark);font-weight:700;">Zalo {COMPANY['zalo']}</a>.</p>
        </div>
      </form>
    </div>
  </div>
</section>
"""
    w("lien-he.html", page(
        title=f"Liên Hệ Đặt Hàng — {SITE_NAME} | Xưởng Gốm Bát Tràng",
        description=f"Liên hệ xưởng gốm {SITE_NAME} tại {COMPANY['address']}. Hotline {COMPANY['phone1']} — "
                     f"nhận báo giá sỉ lọ hoa gốm sứ Bát Tràng trong 30 phút.",
        path="/lien-he.html",
        body=body,
        body_class="contact",
    ))


# --------------------------------------------------------------------------
# BLOG
# --------------------------------------------------------------------------
ARTICLES = [
    dict(slug="chon-lo-hoa-gom-su-hop-phong-thuy", date="10/01/2026",
         title="Cách Chọn Lọ Hoa Gốm Sứ Hợp Phong Thuỷ Cho Từng Không Gian",
         cover="lifestyle-3", excerpt="Màu men, dáng lọ và vị trí đặt lọ hoa đều ảnh hưởng tới phong thuỷ căn nhà — "
                                       "đây là những nguyên tắc cơ bản dễ áp dụng.",
         body="""Trong phong thuỷ, lọ hoa không chỉ là vật trang trí mà còn đại diện cho hành Thổ và Thuỷ,
mang ý nghĩa nuôi dưỡng, sinh sôi. Việc chọn đúng dáng lọ, màu men và vị trí đặt có thể góp phần cân bằng
năng lượng trong không gian sống.

## Chọn dáng lọ theo mục đích

Những dáng lọ có thân tròn đầy như Bầu Tròn, Chum Tròn hay Vò Lùn tượng trưng cho sự sung túc, viên mãn —
rất hợp đặt ở phòng khách hoặc bàn ăn để thu hút tài lộc. Trong khi đó, các dáng thon cao như Ống Bương,
Trụ Gánh mang ý nghĩa vươn lên, phát triển, thích hợp đặt tại bàn làm việc hoặc góc học tập.

## Màu men theo ngũ hành

- **Mệnh Kim**: ưu tiên men trắng, men xi măng ánh bạc.
- **Mệnh Mộc**: chọn tông xanh lá, xanh cổ vịt.
- **Mệnh Thuỷ**: hợp với men xanh biển, men đen huyền.
- **Mệnh Hoả**: nên chọn tông hồng đất, nâu đất ấm áp.
- **Mệnh Thổ**: các tông nâu, be, vàng đất là lựa chọn an toàn.

## Vị trí đặt lọ hoa

Tránh đặt lọ hoa (đặc biệt là lọ rỗng không hoa) ngay lối ra vào chính vì dễ tạo cảm giác trống trải.
Vị trí lý tưởng là góc phòng khách, bàn console hoặc kệ tủ — nơi có thể quan sát được nhưng không cản lối
đi lại trong nhà.

Nếu bạn chưa chắc chắn nên chọn mẫu nào, đội ngũ {name} luôn sẵn sàng tư vấn theo không gian cụ thể của
bạn — chỉ cần gửi ảnh phòng qua Zalo.""".format(name=SITE_NAME)),
    dict(slug="bang-mau-men-gom-bat-trang", date="22/01/2026",
         title="Bảng Màu Men Gốm Bát Tràng: Men Mát, Men Sôi Và Men Khô Khác Nhau Thế Nào?",
         cover="lifestyle-4", excerpt="Ba nhóm men phổ biến nhất tại Bát Tràng — mỗi loại mang một vẻ đẹp "
                                       "và cách chăm sóc riêng, đây là cách phân biệt nhanh.",
         body="""Nếu để ý kỹ, bạn sẽ thấy các mẫu lọ hoa Bát Tràng thường được giới thiệu theo ba nhóm men:
men mát, men sôi và men khô. Đây không chỉ là tên gọi mà còn phản ánh kỹ thuật tráng men và cảm giác bề
mặt hoàn toàn khác nhau.

## Men mát

Đây là nhóm men bóng, mịn, phản chiếu ánh sáng rõ rệt — gồm các tông trắng, tiêu (lấm tấm), hồng, xanh lá
cây và xanh cổ vịt. Men mát cho cảm giác sang trọng, dễ lau chùi và giữ màu bền theo thời gian, phù hợp với
không gian hiện đại, tối giản.

## Men sôi

Men sôi tạo hiệu ứng bề mặt hơi sần, có bọt khí li ti nổi lên trong quá trình nung — mang lại cảm giác thủ
công, mộc mạc hơn men mát. Các tông phổ biến gồm sôi trắng, sôi xanh, sôi nâu và xi măng. Đây là lựa chọn
được ưa chuộng trong phong cách rustic, industrial.

## Men khô

Men khô có bề mặt lì, không phản chiếu ánh sáng, tạo cảm giác gần với đất nung tự nhiên nhất trong ba nhóm.
Các tông khô hồng, khô xanh lá, khô xanh biển và khô đen thường được chọn cho phong cách wabi-sabi, Nhật
tối giản hoặc sân vườn ngoài trời.

Khi đặt hàng sỉ, bạn hoàn toàn có thể yêu cầu phối nhiều tông men trong cùng một đơn để tạo bộ sưu tập đa
dạng màu sắc cho cửa hàng."""),
    dict(slug="huong-dan-bao-quan-lo-gom-su", date="02/02/2026",
         title="Hướng Dẫn Bảo Quản Lọ Hoa Gốm Sứ Bền Đẹp Nhiều Năm",
         cover="lifestyle-5", excerpt="Một vài lưu ý đơn giản giúp lọ hoa gốm sứ giữ được độ bóng men và "
                                       "hạn chế sứt mẻ trong quá trình sử dụng.",
         body="""Gốm sứ Bát Tràng được nung ở nhiệt độ cao nên khá bền, nhưng vẫn cần một vài lưu ý nhỏ để
giữ sản phẩm đẹp lâu dài, đặc biệt với các mẫu có bề mặt sần hoặc men màu tinh tế.

## Vệ sinh đúng cách

Chỉ nên lau bằng khăn mềm hơi ẩm, tránh dùng miếng cọ rửa có bề mặt nhám hoặc hoá chất tẩy mạnh vì có thể
làm mờ lớp men theo thời gian, nhất là với các dòng men khô, men sôi có bề mặt nhạy cảm hơn men bóng.

## Khi cắm hoa tươi

Nên thay nước 2–3 ngày một lần và rửa sạch phần cặn bám bên trong lòng lọ để tránh ố vàng, đặc biệt với
các lọ men trắng sáng màu. Sau khi dùng xong, để lọ khô ráo hoàn toàn trước khi cất giữ.

## Vận chuyển và sắp xếp

Với các mẫu cỡ lớn như Chuông 35, Chuông 42 hay Bom Chân Vuông, nên đặt trên bề mặt phẳng, chắc chắn, có
thể lót đế cao su chống trượt nếu đặt trên sàn gạch bóng hoặc gỗ. Khi vận chuyển số lượng lớn, xưởng
{name} luôn đóng gói bằng xốp/giấy chống sốc và thùng carton chuyên dụng để hạn chế tối đa rủi ro vỡ hàng.

Nếu chẳng may có sản phẩm bị sứt mẻ trong quá trình vận chuyển, hãy liên hệ ngay với xưởng để được hỗ trợ
đổi hàng theo chính sách bán sỉ.""".format(name=SITE_NAME)),
]


def md_to_html(text):
    lines = text.strip().split("\n")
    out = []
    in_list = False
    for line in lines:
        line = line.strip()
        if not line:
            if in_list:
                out.append("</ul>")
                in_list = False
            continue
        if line.startswith("## "):
            if in_list:
                out.append("</ul>")
                in_list = False
            out.append(f"<h2>{esc(line[3:])}</h2>")
        elif line.startswith("- "):
            if not in_list:
                out.append("<ul>")
                in_list = True
            content = line[2:]
            content = content.replace("**", "")
            out.append(f"<li>{content}</li>")
        else:
            out.append(f"<p>{line}</p>")
    if in_list:
        out.append("</ul>")
    return "\n".join(out)


def build_blog():
    cards = []
    for a in ARTICLES:
        cards.append(f"""<article class="article-card" data-reveal>
  <a class="thumb" href="/tin-tuc/{a['slug']}.html"><img src="/assets/img/site/{a['cover']}.jpg" alt="{esc(a['title'])}" loading="lazy"></a>
  <div class="body">
    <span class="date">{a['date']}</span>
    <h3 style="margin:8px 0;"><a href="/tin-tuc/{a['slug']}.html">{esc(a['title'])}</a></h3>
    <p style="color:var(--ink-soft);font-size:.92rem;">{esc(a['excerpt'])}</p>
    <a class="btn btn-sm btn-outline" href="/tin-tuc/{a['slug']}.html">Đọc tiếp</a>
  </div>
</article>""")
    body = f"""
<div class="page-hero">
  <img class="bg" src="/assets/img/site/lifestyle-3-thumb.jpg" alt="">
  <div class="container">
    <div class="breadcrumb"><a href="/">Trang chủ</a><span>/</span><span>Tin tức</span></div>
    <h1>Tin Tức &amp; Cẩm Nang Gốm Sứ</h1>
    <p style="max-width:60ch;color:rgba(255,255,255,.82)">Kiến thức chọn lọ hoa, phối màu men và bảo quản
    gốm sứ Bát Tràng từ đội ngũ {SITE_NAME}.</p>
  </div>
</div>
<section class="section-tight">
  <div class="container grid-3">{"".join(cards)}</div>
</section>
"""
    w("tin-tuc.html", page(
        title=f"Tin Tức &amp; Cẩm Nang Gốm Sứ Bát Tràng | {SITE_NAME}",
        description="Cẩm nang chọn lọ hoa gốm sứ hợp phong thuỷ, bảng màu men Bát Tràng và hướng dẫn bảo "
                     "quản gốm sứ bền đẹp lâu dài.",
        path="/tin-tuc.html",
        body=body,
        body_class="blog",
    ))

    for a in ARTICLES:
        content_html = md_to_html(a["body"])
        body = f"""
<div class="page-hero" style="padding:130px 0 40px;">
  <img class="bg" src="/assets/img/site/{a['cover']}-thumb.jpg" alt="">
  <div class="container">
    <div class="breadcrumb"><a href="/">Trang chủ</a><span>/</span><a href="/tin-tuc.html">Tin tức</a><span>/</span><span>{esc(a['title'])}</span></div>
    <h1 style="max-width:32ch;">{esc(a['title'])}</h1>
    <p style="color:rgba(255,255,255,.7);font-size:.85rem;">{a['date']} · {SITE_NAME}</p>
  </div>
</div>
<section class="section-tight">
  <div class="container">
    <div class="article-body">
      <img src="/assets/img/site/{a['cover']}.jpg" alt="{esc(a['title'])}" loading="lazy">
      {content_html}
      <div class="cta-band" style="margin-top:50px;background:var(--clay-100);color:var(--ink);">
        <div><h2 style="color:var(--ink)">Cần tư vấn chọn mẫu phù hợp?</h2><p style="color:var(--ink-soft)">Nhắn Zalo cho đội ngũ {SITE_NAME} để được gợi ý mẫu lọ hoa theo đúng nhu cầu.</p></div>
        <a class="btn btn-primary" href="https://zalo.me/{COMPANY['zalo']}" target="_blank" rel="noopener">Nhắn Zalo tư vấn</a>
      </div>
    </div>
  </div>
</section>
"""
        w(f"tin-tuc/{a['slug']}.html", page(
            title=f"{a['title']} | {SITE_NAME}",
            description=a["excerpt"],
            path=f"/tin-tuc/{a['slug']}.html",
            body=body,
            og_image=f"{DOMAIN}/assets/img/site/{a['cover']}.jpg",
            body_class="blog",
        ))


# --------------------------------------------------------------------------
# 404, ROBOTS, SITEMAP
# --------------------------------------------------------------------------
def build_404():
    body = f"""
<section style="padding:180px 0 120px;text-align:center;">
  <div class="container">
    <span class="eyebrow" style="justify-content:center;">Lỗi 404</span>
    <h1>Không Tìm Thấy Trang Này</h1>
    <p style="color:var(--ink-soft);max-width:50ch;margin:0 auto 30px;">Trang bạn tìm không tồn tại hoặc đã
    được di chuyển. Hãy quay lại trang sản phẩm để tiếp tục khám phá bộ sưu tập gốm sứ Bát Tràng.</p>
    <a class="btn btn-primary" href="/">Về trang chủ</a>
  </div>
</section>
"""
    w("404.html", page(
        title=f"Không Tìm Thấy Trang | {SITE_NAME}",
        description="Trang không tồn tại.",
        path="/404.html",
        body=body,
    ))


def build_robots_sitemap():
    paths = ["/", "/san-pham.html", "/bao-gia.html", "/gioi-thieu.html", "/tin-tuc.html", "/lien-he.html"]
    paths += [f"/san-pham/{p['slug']}.html" for p in PRODUCTS]
    paths += [f"/tin-tuc/{a['slug']}.html" for a in ARTICLES]
    urls = "\n".join(f"  <url><loc>{DOMAIN}{p}</loc></url>" for p in paths)
    sitemap = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{urls}
</urlset>"""
    w("sitemap.xml", sitemap)
    w("robots.txt", f"User-agent: *\nAllow: /\nSitemap: {DOMAIN}/sitemap.xml\n")


if __name__ == "__main__":
    build_home()
    build_catalog()
    build_product_pages()
    build_price_list()
    build_about()
    build_contact()
    build_blog()
    build_404()
    build_robots_sitemap()
    print(f"Generated {len(PRODUCTS)} product pages + core pages into {OUT}")
