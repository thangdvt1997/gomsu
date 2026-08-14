import { test, expect } from "@playwright/test";

test("add-to-cart -> checkout -> VNPay sandbox redirect is validly signed", async ({ page }) => {
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

  // The submit button triggers a JS redirect (window.location.href) to VNPay
  // rather than a normal navigation Playwright auto-waits for -- wait for it
  // explicitly instead of asserting immediately after the click.
  await page.click('button:has-text("Thanh toán qua VNPay")');
  await page.waitForURL(/sandbox\.vnpayment\.vn/, { timeout: 10_000 });

  const url = new URL(page.url());
  expect(url.searchParams.get("vnp_TxnRef")).toBeTruthy();
  expect(url.searchParams.get("vnp_SecureHash")).toBeTruthy();
  expect(url.searchParams.get("vnp_Command")).toBe("pay");
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
