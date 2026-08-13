# -*- coding: utf-8 -*-
"""
UI/static smoke tests for the Gom Su Trung Mung site.

NOTE: this project is currently a pure static site (HTML/CSS/JS generated
by site/tools/generate_site.py, served by nginx) — there is no backend
API. These tests therefore only cover the rendered pages/assets. If a
real API is added later (e.g. a contact-form submission endpoint), add
its own test module alongside this one.

Usage:
    BASE_URL=http://localhost:8080 python tests/smoke_test.py
"""
import os
import re
import sys
import requests

try:
    sys.stdout.reconfigure(encoding="utf-8")
except AttributeError:
    pass

BASE_URL = os.environ.get("BASE_URL", "http://localhost:8080").rstrip("/")
TIMEOUT = 10

failures = []
checked = 0


def check(label, condition):
    global checked
    checked += 1
    status = "OK  " if condition else "FAIL"
    print(f"[{status}] {label}")
    if not condition:
        failures.append(label)


def get(path):
    r = requests.get(f"{BASE_URL}{path}", timeout=TIMEOUT)
    r.encoding = "utf-8"  # all pages are UTF-8 (<meta charset="UTF-8">); servers don't always declare it in headers
    return r


def main():
    print(f"Smoke testing {BASE_URL}\n" + "-" * 50)

    # Core pages
    core_pages = {
        "/index.html": "Gốm Sứ Trung Mừng",
        "/san-pham.html": "data-catalog-grid",
        "/bao-gia.html": "Bảng Giá Sỉ",
        "/gioi-thieu.html": "Giữ Lửa Nghề",
        "/lien-he.html": "Liên Hệ",
        "/tin-tuc.html": "Tin Tức",
    }
    for path, marker in core_pages.items():
        try:
            r = get(path)
            check(f"GET {path} -> 200", r.status_code == 200)
            check(f"GET {path} contains {marker!r}", marker in r.text)
        except requests.RequestException as e:
            check(f"GET {path} reachable ({e})", False)

    # Root path (nginx index)
    try:
        r = get("/")
        check("GET / -> 200", r.status_code == 200)
    except requests.RequestException as e:
        check(f"GET / reachable ({e})", False)

    # Assets
    try:
        r = get("/assets/css/style.css")
        check("GET /assets/css/style.css -> 200", r.status_code == 200)
        check("CSS content-type", "css" in r.headers.get("Content-Type", ""))
    except requests.RequestException as e:
        check(f"CSS reachable ({e})", False)

    try:
        r = get("/assets/js/main.js")
        check("GET /assets/js/main.js -> 200", r.status_code == 200)
    except requests.RequestException as e:
        check(f"JS reachable ({e})", False)

    # 404 handling
    try:
        r = get("/trang-khong-ton-tai-xyz.html")
        check("Unknown page returns 404", r.status_code == 404)
    except requests.RequestException as e:
        check(f"404 page check ({e})", False)

    # Crawl every URL declared in sitemap.xml (all 60 product pages + blog + core)
    try:
        r = get("/sitemap.xml")
        check("GET /sitemap.xml -> 200", r.status_code == 200)
        locs = re.findall(r"<loc>(.*?)</loc>", r.text)
        check("sitemap.xml has product/page URLs", len(locs) >= 60)
        print(f"  -> {len(locs)} URLs declared in sitemap.xml")

        broken = []
        for loc in locs:
            path = re.sub(r"^https?://[^/]+", "", loc)
            try:
                resp = get(path)
                if resp.status_code != 200:
                    broken.append((path, resp.status_code))
            except requests.RequestException as e:
                broken.append((path, str(e)))
        check(f"All {len(locs)} sitemap URLs return 200", not broken)
        if broken:
            for path, status in broken:
                print(f"       broken: {path} -> {status}")
    except requests.RequestException as e:
        check(f"sitemap.xml reachable ({e})", False)

    # Spot-check one product detail page for SEO/schema essentials
    try:
        r = get("/san-pham/chum-2-tai.html")
        check("Product page 200", r.status_code == 200)
        check("Product page has JSON-LD schema", '"@type": "Product"' in r.text)
        check("Product page has price", "145.000" in r.text or "145,000" in r.text)
        check("Product page has code TM-054", "TM-054" in r.text)
    except requests.RequestException as e:
        check(f"Product page reachable ({e})", False)

    print("-" * 50)
    print(f"{checked - len(failures)}/{checked} checks passed")
    if failures:
        print(f"\n{len(failures)} FAILURE(S):")
        for f in failures:
            print(f"  - {f}")
        sys.exit(1)
    print("\nAll smoke tests passed.")


if __name__ == "__main__":
    main()
