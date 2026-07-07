import { expect, test } from "@playwright/test";

test.describe("Projects list", () => {
  test("filter updates the URL and survives a refresh", async ({ page }) => {
    await page.goto("/projects");

    // Filtering by a tag unique to one project narrows the grid.
    await page.getByRole("button", { name: "Stripe", exact: true }).click();
    await expect(page).toHaveURL(/\?tag=Stripe/);
    await expect(page.getByRole("link", { name: /MoosanClub/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /HoopRipple/ })).toHaveCount(0);

    // Acceptance: the filter survives a reload because it lives in the URL.
    await page.reload();
    await expect(page).toHaveURL(/\?tag=Stripe/);
    await expect(page.getByRole("button", { name: "Stripe", exact: true })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(page.getByRole("link", { name: /MoosanClub/ })).toBeVisible();
  });
});

test.describe("Project detail", () => {
  test("direct navigation renders the four case-study sections", async ({ page }) => {
    await page.goto("/projects/moosanclub");

    await expect(page.getByRole("heading", { name: "MoosanClub", level: 1 })).toBeVisible();
    for (const section of ["Problem", "Approach", "Tradeoffs", "Outcome"]) {
      await expect(page.getByRole("heading", { name: section, level: 2 })).toBeVisible();
    }
  });

  test("exposes CreativeWork structured data", async ({ page }) => {
    await page.goto("/projects/moosanclub");
    const jsonLd = await page.locator('script[type="application/ld+json"]').first().textContent();
    expect(jsonLd).toContain("CreativeWork");
  });
});
