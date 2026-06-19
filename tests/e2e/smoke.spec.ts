import { type Page, expect, test } from "@playwright/test";

/**
 * Nav links and the theme toggle live inside the collapsed mobile menu on
 * narrow viewports. Open it first if present so callers can interact with
 * those controls regardless of viewport.
 */
async function openMobileNavIfPresent(page: Page) {
  const menuButton = page.getByRole("button", { name: "Open menu" });
  if (await menuButton.isVisible()) {
    await menuButton.click();
  }
}

test.describe("Homepage", () => {
  test("renders with no console errors", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: "Get in touch" })).toBeVisible();
    expect(consoleErrors).toEqual([]);
  });

  test("is responsive on mobile viewports", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
  });
});

test.describe("About page", () => {
  test("renders via nav link", async ({ page }) => {
    await page.goto("/");
    await openMobileNavIfPresent(page);
    await page.getByRole("link", { name: "About" }).first().click();

    await expect(page).toHaveURL(/\/about$/);
    await expect(page.getByRole("heading", { name: "About", level: 1 })).toBeVisible();
  });
});

test.describe("Theme toggle", () => {
  test("switches theme and persists across reload", async ({ page }) => {
    await page.goto("/");
    await openMobileNavIfPresent(page);

    const html = page.locator("html");
    const toggle = page.getByRole("button", { name: /^Theme:/ });

    await expect(html).not.toHaveClass(/dark/);

    // Light -> Dark
    await toggle.click();
    await expect(html).toHaveClass(/dark/);

    await page.reload();
    await expect(html).toHaveClass(/dark/);
  });
});
