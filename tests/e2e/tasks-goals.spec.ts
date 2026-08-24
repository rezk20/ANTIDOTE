import { test, expect } from "@playwright/test";

test.describe("Tasks and Goals Engine E2E", () => {
  test("unauthenticated access redirects to /login", async ({ page }) => {
    await page.goto("/tasks");
    await expect(page).toHaveURL(/.*login/);

    await page.goto("/goals");
    await expect(page).toHaveURL(/.*login/);
  });
});
