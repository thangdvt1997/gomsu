import { test, expect } from "@playwright/test";

// Parity checks ported from the old static site's tests/smoke_test.py --
// same assertions, now against the Next.js + Postgres stack, so a pass here
// means the rewrite didn't regress anything the original suite covered.

const CORE_PAGES: { path: string; marker: string }[] = [
  { path: "/", marker: "Gốm Sứ Trung Mừng" },
  { path: "/bao-gia", marker: "Bảng Giá Sỉ" },
  { path: "/gioi-thieu", marker: "Giữ Lửa Nghề" },
  { path: "/lien-he", marker: "Liên Hệ" },
  { path: "/tin-tuc", marker: "Tin Tức" },
];

for (const { path, marker } of CORE_PAGES) {
  test(`core page ${path} returns 200 and contains marker`, async ({ page }) => {
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await expect(page.locator("body")).toContainText(marker);
  });
}

test("catalog page returns 200 and renders the filterable product grid", async ({ page }) => {
  const res = await page.goto("/san-pham");
  expect(res?.status()).toBe(200);
  // data-catalog-grid is an HTML attribute (the vanilla-JS filter hooks onto
  // it), not visible text, so check the DOM directly rather than body text.
  await expect(page.locator("[data-catalog-grid]")).toBeVisible();
});

test("static assets are reachable", async ({ request }) => {
  const css = await request.get("/assets/css/style.css");
  expect(css.status()).toBe(200);
  expect(css.headers()["content-type"]).toContain("css");

  const js = await request.get("/assets/js/main.js");
  expect(js.status()).toBe(200);
});

test("unknown page returns 404", async ({ page }) => {
  const res = await page.goto("/this-page-does-not-exist-xyz");
  expect(res?.status()).toBe(404);
});

test("sitemap.xml has product/page URLs and every one returns 200", async ({ request }) => {
  const res = await request.get("/sitemap.xml");
  expect(res.status()).toBe(200);
  const body = await res.text();
  const urls = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  expect(urls.length).toBeGreaterThanOrEqual(60);

  const results = await Promise.all(
    urls.map(async (url) => {
      const path = new URL(url).pathname;
      const r = await request.get(path);
      return { path, status: r.status() };
    }),
  );
  const broken = results.filter((r) => r.status !== 200);
  expect(broken, `broken sitemap URLs: ${JSON.stringify(broken)}`).toEqual([]);
});

test("product page has JSON-LD schema, price, and code", async ({ page }) => {
  await page.goto("/san-pham/chum-2-tai");
  const jsonLdHandle = page.locator('script[type="application/ld+json"]');
  const count = await jsonLdHandle.count();
  let sawProduct = false;
  for (let i = 0; i < count; i++) {
    const text = await jsonLdHandle.nth(i).innerText();
    if (text.includes('"@type":"Product"') || text.includes('"@type": "Product"')) sawProduct = true;
  }
  expect(sawProduct).toBe(true);
  await expect(page.locator("body")).toContainText("145.000");
  await expect(page.locator("body")).toContainText("TM-054");
});

test("robots.txt points at the sitemap", async ({ request }) => {
  const res = await request.get("/robots.txt");
  expect(res.status()).toBe(200);
  const body = await res.text();
  expect(body).toContain("Sitemap:");
  expect(body).toContain("/sitemap.xml");
});
