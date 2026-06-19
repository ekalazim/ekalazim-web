/** Accent color used for a project's hover/highlight state. */
export type ProjectAccent = "primary" | "secondary" | "tertiary";

/**
 * Summary shape used for project cards (homepage + `/projects` grid).
 * The full case-study fields (problem/approach/tradeoffs/outcome) are
 * added in Phase 2 alongside `/projects/[slug]`.
 */
export interface ProjectSummary {
  slug: string;
  title: string;
  summary: string;
  tags: readonly string[];
  accent: ProjectAccent;
}
