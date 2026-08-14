import { test, expect } from "@playwright/test";

test("add-to-cart -> checkout -> VietQR payment page shows the order and QR code", async ({ page }) => {
  await page.goto("/san-pham/chum-2-tai");
  await page.click('button:has-text("Thêm vào giỏ")');
  await expect(page.locator('button:has-text("Đã thêm vào giỏ")')).toBeVisible();

  await page.goto("/gio-hang");
  await expect(page.locator("body")).toContainText("Chum 2 Tai");

  await page.click('text=Tiến hành thanh toán');
  await expect(page).toHaveURL(/\/thanh-toan$/);

  await page.fill('input[name="customerName"]', "Playwright Test");
  await page.fill('input[name="customerPhone"]', "0912345678");
  await page.fill('input[name="shippingAddress"]', "123 Test Street, Ha Noi");

  await page.click('button:has-text("Lấy mã QR chuyển khoản")');
  await page.waitForURL(/\/thanh-toan\/vietqr\/[a-z0-9]{20,}$/, { timeout: 10_000 });

  await expect(page.locator("body")).toContainText("Chum 2 Tai");
  await expect(page.locator("body")).toContainText("GSM-");

  // Must show either the real QR image (VIETQR_BANK_ID/ACCOUNT_NO
  // configured) or a clear "not configured" fallback message -- never
  // neither, which would be a silently broken checkout page.
  const hasQr = await page.locator('img[alt*="Mã VietQR"]').count();
  const hasFallbackMessage = await page.locator("text=Chưa cấu hình tài khoản").count();
  expect(hasQr + hasFallbackMessage).toBeGreaterThan(0);
});

test("a fully Lien-he (null-price) product has no add-to-cart button, only a quote request", async ({ page }) => {
  // Ba Beo's sizes are all null-priced by design -- it must never expose a
  // cart path, only the quote-request form (verified server-side too, in
  // /api/checkout's rejection of null-priced items -- see admin-products
  // test coverage / the manual curl checks run during Phase 4).
  await page.goto("/san-pham/ba-beo");
  await expect(page.locator('button:has-text("Thêm vào giỏ")')).toHaveCount(0);
  await expect(page.locator('button:has-text("Yêu cầu báo giá")')).toBeVisible();
});
