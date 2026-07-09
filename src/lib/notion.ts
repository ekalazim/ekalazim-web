import { env } from "@/lib/env";
import { calculateReadingTime } from "@/lib/reading-time";
import type { BlogPost, PostSummary } from "@/types/post";
import { Client, isFullPage } from "@notionhq/client";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { NotionToMarkdown } from "notion-to-md";

/**
 * Notion data layer — the ONLY module that talks to Notion. All access goes
 * through here so the API key never reaches the browser and every response is
 * mapped to our own typed objects. See `.claude/patterns/data-fetching.md`.
 *
 * The client is optional by design: when credentials are absent the blog
 * degrades to an empty state (list → `[]`, single → `null`) rather than
 * failing the build. Once `NOTION_API_KEY` + `NOTION_BLOG_DATABASE_ID` are set,
 * everything lights up with no code change.
 */

// Module-level singletons.
const notion = new Client({ auth: env.NOTION_API_KEY });
const n2m = new NotionToMarkdown({ notionClient: notion });

/** A single value from a Notion page's `properties` map. */
type PageProperty = PageObjectResponse["properties"][string];

export async function getAllPosts(): Promise<PostSummary[]> {
  const databaseId = env.NOTION_BLOG_DATABASE_ID;
  if (!databaseId) return [];

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: "Status",
        select: { equals: "Published" },
      },
      sorts: [{ property: "Published Date", direction: "descending" }],
    });

    return response.results
      .filter(isFullPage)
      .map(mapPageToSummary)
      .filter((post): post is PostSummary => post !== null);
  } catch (error) {
    // In production Sentry captures this; ISR keeps serving the last good build.
    console.error("[Notion] Failed to fetch posts:", error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const databaseId = env.NOTION_BLOG_DATABASE_ID;
  if (!databaseId) return null;

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        and: [
          { property: "Slug", rich_text: { equals: slug } },
          { property: "Status", select: { equals: "Published" } },
        ],
      },
      page_size: 1,
    });

    const page = response.results[0];
    if (!page || !isFullPage(page)) return null;

    const summary = mapPageToSummary(page);
    if (!summary) return null;

    const mdBlocks = await n2m.pageToMarkdown(page.id);
    const content = n2m.toMarkdownString(mdBlocks).parent ?? "";

    return {
      ...summary,
      id: page.id,
      coverImage: getFile(page.properties["Cover Image"]),
      content,
      readingTime: calculateReadingTime(content),
    };
  } catch (error) {
    console.error("[Notion] Failed to fetch post:", error);
    return null;
  }
}

/**
 * Maps a full Notion page to a `PostSummary`. Returns `null` when required
 * fields (slug, published date) are missing so malformed rows are skipped
 * rather than crashing the list.
 */
export function mapPageToSummary(page: PageObjectResponse): PostSummary | null {
  const props = page.properties;

  const slug = getRichText(props.Slug);
  const publishedAt = getDate(props["Published Date"]);
  if (!slug || !publishedAt) return null;

  return {
    slug,
    title: getTitle(props.Title),
    excerpt: getRichText(props.Excerpt),
    tags: getMultiSelect(props.Tags),
    publishedAt,
  };
}

// --- Type-safe Notion property extractors ------------------------------------

function getTitle(prop: PageProperty | undefined): string {
  return prop?.type === "title" ? prop.title.map((t) => t.plain_text).join("") : "";
}

function getRichText(prop: PageProperty | undefined): string {
  return prop?.type === "rich_text" ? prop.rich_text.map((t) => t.plain_text).join("") : "";
}

function getMultiSelect(prop: PageProperty | undefined): string[] {
  return prop?.type === "multi_select" ? prop.multi_select.map((option) => option.name) : [];
}

function getDate(prop: PageProperty | undefined): string | null {
  return prop?.type === "date" ? (prop.date?.start ?? null) : null;
}

function getFile(prop: PageProperty | undefined): string | null {
  if (prop?.type !== "files") return null;
  const file = prop.files[0];
  if (!file) return null;
  // The `type` discriminant is optional on Notion file objects, so narrow on the
  // presence of the `external` key instead.
  return "external" in file ? file.external.url : file.file.url;
}
