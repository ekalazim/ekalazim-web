/**
 * Summary shape used for post cards (homepage + `/blog` list).
 *
 * `readingTime` is optional: it is derived from the article body, and the list
 * query intentionally does not fetch post content (see
 * `.claude/patterns/data-fetching.md`), so summaries omit it. The full post
 * (`BlogPost`) always carries it.
 */
export interface PostSummary {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  tags: readonly string[];
  readingTime?: number;
}

/**
 * Full blog post, mapped from a Notion page. `content` is the article body as
 * markdown, fetched only when loading a single post via `getPostBySlug`.
 */
export interface BlogPost extends PostSummary {
  id: string;
  coverImage: string | null;
  content: string;
  readingTime: number;
}
