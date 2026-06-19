/**
 * Summary shape used for post cards (homepage + `/blog` list).
 * Full Notion-backed fields are added in Phase 3 (`.claude/patterns/data-fetching.md`).
 */
export interface PostSummary {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readingTime: number;
  tags: readonly string[];
}
