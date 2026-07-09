import { mapPageToSummary } from "@/lib/notion";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { describe, expect, it } from "vitest";

/**
 * Builds a minimal Notion page whose `properties` cover the fields
 * `mapPageToSummary` reads. Only the shapes the extractors touch are provided,
 * so the object is cast to the full response type for the test.
 */
function buildPage(overrides: {
  title?: string;
  slug?: string | null;
  excerpt?: string;
  tags?: string[];
  publishedAt?: string | null;
}): PageObjectResponse {
  const {
    title = "Hello World",
    slug = "hello-world",
    excerpt = "An intro.",
    tags = ["React"],
    publishedAt = "2026-01-01",
  } = overrides;

  const properties: Record<string, unknown> = {
    Title: { type: "title", title: title ? [{ plain_text: title }] : [] },
    Slug: { type: "rich_text", rich_text: slug ? [{ plain_text: slug }] : [] },
    Excerpt: { type: "rich_text", rich_text: excerpt ? [{ plain_text: excerpt }] : [] },
    Tags: { type: "multi_select", multi_select: tags.map((name) => ({ name })) },
    "Published Date": { type: "date", date: publishedAt ? { start: publishedAt } : null },
  };

  // Only the `properties` read by the mapper matter here; cast the partial page
  // to the full response type for the test.
  return { properties } as unknown as PageObjectResponse;
}

describe("mapPageToSummary", () => {
  it("maps a well-formed page to a post summary", () => {
    const summary = mapPageToSummary(
      buildPage({ title: "My Post", slug: "my-post", tags: ["React", "Perf"] }),
    );
    expect(summary).toEqual({
      slug: "my-post",
      title: "My Post",
      excerpt: "An intro.",
      tags: ["React", "Perf"],
      publishedAt: "2026-01-01",
    });
  });

  it("returns null when the slug is missing", () => {
    expect(mapPageToSummary(buildPage({ slug: null }))).toBeNull();
  });

  it("returns null when the published date is missing", () => {
    expect(mapPageToSummary(buildPage({ publishedAt: null }))).toBeNull();
  });

  it("handles a page with no tags", () => {
    const summary = mapPageToSummary(buildPage({ tags: [] }));
    expect(summary?.tags).toEqual([]);
  });
});
