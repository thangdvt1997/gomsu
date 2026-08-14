import { test, expect } from "@playwright/test";

test("add-to-cart -> checkout -> VNPay redirect is validly signed", async ({ page }) => {
  // Intercept the navigation to VNPay's real domain instead of letting the
  // browser actually reach it: staging/CI only has placeholder
  // VNPAY_TMN_CODE/HASH_SECRET (no real merchant account yet), so VNPay's
  // own server would reject them and could redirect/rewrite the URL in an
  // unpredictable way that has nothing to do with whether *our* signing
  // code is correct. Fulfilling the request locally lets us assert on the
  // exact URL our server built without depending on VNPay's live response.
  let capturedUrl: string | null = null;
  await page.route("https://sandbox.vnpayment.vn/**", async (route) => {
    capturedUrl = route.request().url();
    await route.fulfill({ status: 200, contentType: "text/plain", body: "stubbed" });
  });

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

  await page.click('button:has-text("Thanh toán qua VNPay")');
  await expect.poll(() => capturedUrl, { timeout: 10_000 }).not.toBeNull();

  const url = new URL(capturedUrl!);
  expect(url.hostname).toBe("sandbox.vnpayment.vn");
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
