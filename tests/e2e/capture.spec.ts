import { test, expect } from "@playwright/test";

test.describe("Brain Dump Quick Capture (Phase F2)", () => {
  test("unauthenticated access to /brain-dump redirects to /login", async ({ page }) => {
    await page.goto("/brain-dump");
    await expect(page).toHaveURL(/.*\/login/);
  });
});
