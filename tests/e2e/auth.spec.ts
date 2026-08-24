import { test, expect } from "@playwright/test";

test.describe("Authentication & Route Guard (Phase F1)", () => {
  test("unauthenticated visit to /home redirects to /login", async ({ page }) => {
    await page.goto("/home");
    await expect(page).toHaveURL(/.*\/login/);
  });

  test("unauthenticated visit to root / redirects to /login", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/.*\/login/);
  });

  test("login page renders branding and accessible inputs", async ({ page }) => {
    await page.goto("/login");

    // Branding
    await expect(page.locator("h1")).toContainText("LIFE OS");

    // Form inputs
    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');
    const submitButton = page.locator('button[type="submit"]');

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
  });
});
