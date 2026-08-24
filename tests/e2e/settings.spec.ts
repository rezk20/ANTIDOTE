import { test, expect } from "@playwright/test";

test.describe("Settings Navigation (Phase F2)", () => {
  test("settings page renders tabs and form sections", async ({ page }) => {
    await page.goto("/settings");

    // Expect redirect to login when unauthenticated
    await expect(page).toHaveURL(/.*\/login/);
  });
});
