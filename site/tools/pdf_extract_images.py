# -*- coding: utf-8 -*-
"""
Extract the embedded per-row product photos straight from the workshop's
own price-list PDF (ceramic/product_image/BÁO GIÁ LỌ HOA GỐM SỨ TRUNG MỪNG
2026.pdf) and match each one to its product by (1) matching the row's
product-name text against products_data.PRODUCTS, in document order, then
(2) assigning every embedded image on that page whose vertical position
falls within that row's span (from this row's name to the next row's name)
to that product.

This is the authoritative source for product photos — reused folder shots
in image_map.PRODUCT_IMAGES are only ever a bonus/secondary gallery image
appended after the ones extracted here (see build_images.py).

Run once from the repo root whenever the PDF changes:
    python site/tools/pdf_extract_images.py

Requires: pip install pymupdf
"""
import json
import os
import sys
import unicodedata

sys.path.insert(0, os.path.dirname(__file__))
from products_data import PRODUCTS

import pymupdf

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
PDF_PATH = os.path.join(ROOT, "ceramic", "product_image",
                        "BÁO GIÁ LỌ HOA GỐM SỨ TRUNG MỪNG 2026.pdf")
OUT_DIR = os.path.join(ROOT, "ceramic", "pdf_extracted")
MAP_OUT = os.path.join(os.path.dirname(__file__), "pdf_image_map.json")


def norm(s):
    s = s.strip().lower()
    s = unicodedata.normalize("NFKD", s)
    return "".join(c for c in s if not unicodedata.combining(c))


def match_name_blocks(doc):
    remaining = [(p["slug"], norm(p["name"])) for p in PRODUCTS]
    name_blocks = []
    for pno, page in enumerate(doc):
        blocks = [b for b in page.get_text("blocks") if b[4].strip()]
        blocks.sort(key=lambda b: b[1])
        for b in blocks:
            first_line = b[4].strip().split("\n")[0]
            nfl = norm(first_line)
            if not nfl:
                continue
            match_idx = None
            for idx, (slug, nname) in enumerate(remaining[:6]):
                if nfl == nname or nfl.startswith(nname) or nname.startswith(nfl):
                    match_idx = idx
                    break
            if match_idx is not None:
                slug, _ = remaining.pop(match_idx)
                name_blocks.append({"page": pno, "slug": slug, "y0": b[1], "y1": b[3]})
    if remaining:
        print(f"WARNING: {len(remaining)} products had no matching row in the PDF: "
              f"{[s for s, _ in remaining]}")
    return name_blocks


def extract(doc, name_blocks):
    os.makedirs(OUT_DIR, exist_ok=True)
    by_page = {}
    for nb in name_blocks:
        by_page.setdefault(nb["page"], []).append(nb)

    assignments = {}
    unassigned = []
    for pno, page in enumerate(doc):
        rows = sorted(by_page.get(pno, []), key=lambda r: r["y0"])
        if not rows:
            continue
        page_h = page.rect.height
        gaps = [rows[i + 1]["y0"] - rows[i]["y0"] for i in range(len(rows) - 1)]
        median_gap = sorted(gaps)[len(gaps) // 2] if gaps else 90
        spans = []
        for i, row in enumerate(rows):
            top = row["y0"] - 6
            if i + 1 < len(rows):
                bottom = rows[i + 1]["y0"] - 6
            else:
                # last named row on the page: cap to a typical row height so
                # we don't swallow trailing unlabeled rows (this PDF has a
                # couple of blank-name rows after the last named product).
                bottom = min(page_h - 30, row["y0"] + median_gap + 20)
            spans.append((top, bottom, row["slug"]))

        for im in page.get_image_info(xrefs=True):
            y0, y1 = im["bbox"][1], im["bbox"][3]
            cy = (y0 + y1) / 2
            slug = next((s for top, bottom, s in spans if top <= cy < bottom), None)
            if slug is None:
                unassigned.append({"page": pno, "bbox": im["bbox"]})
                continue
            base = doc.extract_image(im["xref"])
            idx = len(assignments.get(slug, [])) + 1
            fname = f"{slug}-pdf{idx}.{base['ext']}"
            with open(os.path.join(OUT_DIR, fname), "wb") as fh:
                fh.write(base["image"])
            assignments.setdefault(slug, []).append(
                {"y0": y0, "x0": im["bbox"][0], "file": fname}
            )

    for slug in assignments:
        assignments[slug].sort(key=lambda r: (r["y0"], r["x0"]))

    return assignments, unassigned


if __name__ == "__main__":
    doc = pymupdf.open(PDF_PATH)
    name_blocks = match_name_blocks(doc)
    print(f"Matched {len(name_blocks)} / {len(PRODUCTS)} product rows")
    assignments, unassigned = extract(doc, name_blocks)
    total = sum(len(v) for v in assignments.values())
    print(f"Extracted {total} images -> {len(assignments)} products, {OUT_DIR}")
    if unassigned:
        print(f"{len(unassigned)} embedded image(s) did not fall inside any matched "
              f"product row (likely blank/unlabeled rows in the PDF) — skipped:")
        for u in unassigned:
            print("  ", u)

    pdf_images = {slug: [r["file"] for r in rows] for slug, rows in sorted(assignments.items())}
    with open(MAP_OUT, "w", encoding="utf-8") as fh:
        json.dump(pdf_images, fh, ensure_ascii=False, indent=1)
    print(f"Wrote mapping -> {MAP_OUT} (copy into image_map.PDF_IMAGES if it changed)")
