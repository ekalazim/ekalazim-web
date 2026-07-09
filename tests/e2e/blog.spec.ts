import { expect, test } from "@playwright/test";

test.describe("Blog list", () => {
  test("renders the blog index", async ({ page }) => {
    await page.goto("/blog");
    await expect(page.getByRole("heading", { name: "Blog", level: 1 })).toBeVisible();

    // With posts, the grid shows cards; without (e.g. no Notion creds in CI),
    // the explorer shows an empty state. Either way the page is healthy.
    const cards = page.getByRole("link", { name: /^Read / });
    const emptyState = page.getByText(/No posts (tagged|published)/);
    await expect(cards.first().or(emptyState)).toBeVisible();
  });
});

test.describe("Blog detail", () => {
  test("opens a post and exposes BlogPosting structured data", async ({ page }) => {
    await page.goto("/blog");
    const firstPost = page.getByRole("link", { name: /^Read / }).first();

    // Detail assertions require published content; skip when the blog is empty.
    test.skip((await firstPost.count()) === 0, "no published posts in this environment");

    await firstPost.click();
    await expect(page).toHaveURL(/\/blog\/.+/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    const jsonLd = await page.locator('script[type="application/ld+json"]').first().textContent();
    expect(jsonLd).toContain("BlogPosting");
  });
});

test.describe("RSS feed", () => {
  test("serves a valid feed at /rss.xml", async ({ request }) => {
    const response = await request.get("/rss.xml");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("xml");

    const body = await response.text();
    expect(body).toContain("<rss");
    expect(body).toContain("<channel>");
  });
});
