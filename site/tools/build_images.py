# -*- coding: utf-8 -*-
"""
Resize/optimize the source photos in ceramic/product_image/ into web-ready
assets under site/assets/img/. Run from the repo root:

    python site/tools/build_images.py
"""
import os
import sys
from PIL import Image, ImageOps

sys.path.insert(0, os.path.dirname(__file__))
from image_map import PRODUCT_IMAGES, LIFESTYLE_IMAGES, WORKSHOP_IMAGES, SRC_DIR, WATERMARKED_EXCLUDE

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SRC = os.path.join(ROOT, SRC_DIR)
OUT_PRODUCTS = os.path.join(ROOT, "site", "assets", "img", "products")
OUT_SITE = os.path.join(ROOT, "site", "assets", "img", "site")

MAIN_MAX = 1400
THUMB_MAX = 700

os.makedirs(OUT_PRODUCTS, exist_ok=True)
os.makedirs(OUT_SITE, exist_ok=True)


def load(fname):
    path = os.path.join(SRC, fname)
    img = Image.open(path)
    img = ImageOps.exif_transpose(img)
    if img.mode != "RGB":
        img = img.convert("RGB")
    return img


def save_variant(img, out_path, max_side, quality=82):
    w, h = img.size
    scale = min(1.0, max_side / max(w, h))
    if scale < 1.0:
        img = img.resize((max(1, int(w * scale)), max(1, int(h * scale))), Image.LANCZOS)
    img.save(out_path, "JPEG", quality=quality, optimize=True, progressive=True)


def process_product_images():
    count = 0
    for slug, files in PRODUCT_IMAGES.items():
        for i, fname in enumerate(files, start=1):
            if fname in WATERMARKED_EXCLUDE:
                print(f"SKIP (watermark): {fname}")
                continue
            img = load(fname)
            main_out = os.path.join(OUT_PRODUCTS, f"{slug}-{i}.jpg")
            thumb_out = os.path.join(OUT_PRODUCTS, f"{slug}-{i}-thumb.jpg")
            save_variant(img.copy(), main_out, MAIN_MAX)
            save_variant(img.copy(), thumb_out, THUMB_MAX, quality=78)
            count += 2
    print(f"Product images written: {count} files -> {OUT_PRODUCTS}")


def process_site_images(files, prefix):
    count = 0
    for i, fname in enumerate(files, start=1):
        if fname in WATERMARKED_EXCLUDE:
            print(f"SKIP (watermark): {fname}")
            continue
        img = load(fname)
        main_out = os.path.join(OUT_SITE, f"{prefix}-{i}.jpg")
        thumb_out = os.path.join(OUT_SITE, f"{prefix}-{i}-thumb.jpg")
        save_variant(img.copy(), main_out, 1800 if prefix == "hero" else MAIN_MAX)
        save_variant(img.copy(), thumb_out, THUMB_MAX, quality=78)
        count += 2
    print(f"{prefix} images written: {count} files -> {OUT_SITE}")


if __name__ == "__main__":
    process_product_images()
    process_site_images(LIFESTYLE_IMAGES, "lifestyle")
    process_site_images(WORKSHOP_IMAGES, "workshop")
    print("Done.")
