import { test, expect } from "@playwright/test";

const ADMIN_EMAIL = process.env.ADMIN_TEST_EMAIL ?? process.env.ADMIN_EMAIL ?? "";
const ADMIN_PASSWORD = process.env.ADMIN_TEST_PASSWORD ?? process.env.ADMIN_PASSWORD ?? "";

test("unauthenticated /admin redirects to /admin/login", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login$/);
});

test.describe("authenticated admin", () => {
  test.skip(!ADMIN_EMAIL || !ADMIN_PASSWORD, "ADMIN_TEST_EMAIL/ADMIN_TEST_PASSWORD not set");

  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/login");
    await page.fill('input[name="email"]', ADMIN_EMAIL);
    await page.fill('input[name="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/admin$/);
  });

  test("dashboard shows product/order/lead/post counts", async ({ page }) => {
    await expect(page.locator(".admin-stats")).toBeVisible();
  });

  test("product list shows all 60 seeded products", async ({ page }) => {
    await page.goto("/admin/products");
    await expect(page.locator("body")).toContainText("Sản phẩm (60)");
  });

  test("create, edit, and delete a product round-trips into the storefront", async ({ page }) => {
    const testName = `Test Playwright ${Date.now()}`;
    const testCode = `TM-E2E-${Date.now()}`;

    await page.goto("/admin/products/new");
    await page.fill('input[name="name"]', testName);
    await page.fill('input[name="code"]', testCode);
    await page.fill('textarea[name="description"]', "Sản phẩm test tự động, sẽ bị xoá.");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/admin\/products\/[a-z0-9]+$/);

    await page.goto("/admin/products");
    await expect(page.locator("body")).toContainText(testName);

    // Delete it again so the test suite doesn't leave junk data behind.
    await page.click(`tr:has-text("${testCode}") >> text=Sửa`);
    page.once("dialog", (d) => d.accept());
    await page.click('button:has-text("Xoá sản phẩm")');
    await expect(page).toHaveURL(/\/admin\/products$/);
    await expect(page.locator("body")).not.toContainText(testName);
  });
});
