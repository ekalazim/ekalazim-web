import { expect, test } from "@playwright/test";

/**
 * Contact form E2E. Covers client validation, the honeypot path, and a
 * successful submission. No external services are exercised: without Resend/
 * Upstash credentials the Server Action degrades to a log-only success, so
 * these tests are deterministic in CI.
 */
test.describe("Contact form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByRole("heading", { name: "Contact", level: 1 })).toBeVisible();
  });

  test("shows validation errors on empty submit", async ({ page }) => {
    await page.getByRole("button", { name: "Send Message" }).click();

    await expect(page.getByText("Name must be at least 2 characters")).toBeVisible();
    await expect(page.getByText("Please enter a valid email address")).toBeVisible();
    await expect(page.getByText("Message must be at least 10 characters")).toBeVisible();
  });

  test("rejects an invalid email", async ({ page }) => {
    await page.getByRole("textbox", { name: "Name" }).fill("Ada Lovelace");
    await page.getByRole("textbox", { name: "Email" }).fill("not-an-email");
    await page.getByRole("textbox", { name: "Message" }).fill("This is a sufficiently long message.");
    await page.getByRole("button", { name: "Send Message" }).click();

    await expect(page.getByText("Please enter a valid email address")).toBeVisible();
  });

  test("submits successfully with valid input", async ({ page }) => {
    await page.getByRole("textbox", { name: "Name" }).fill("Ada Lovelace");
    await page.getByRole("textbox", { name: "Email" }).fill("ada@example.com");
    await page
      .getByRole("textbox", { name: "Message" })
      .fill("Hello! I'd love to work together on something.");
    await page.getByRole("button", { name: "Send Message" }).click();

    await expect(page.getByText("Message sent!")).toBeVisible();
  });

  test("silently accepts a filled honeypot (bot path)", async ({ page }) => {
    await page.getByRole("textbox", { name: "Name" }).fill("Spam Bot");
    await page.getByRole("textbox", { name: "Email" }).fill("bot@example.com");
    await page.getByRole("textbox", { name: "Message" }).fill("Buy cheap widgets at spam dot com now.");
    // The honeypot lives in a display:none wrapper, so it isn't actionable.
    // React Hook Form reads uncontrolled inputs from the DOM at submit, so
    // setting the value directly is enough to trip the server-side check.
    await page.locator("#company").evaluate((el) => {
      (el as HTMLInputElement).value = "Evil Corp";
    });
    await page.getByRole("button", { name: "Send Message" }).click();

    // Bot submissions return a fake success and never reveal the trap.
    await expect(page.getByText("Message sent!")).toBeVisible();
  });
});
