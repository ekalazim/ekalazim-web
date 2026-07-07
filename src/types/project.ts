/** Accent color used for a project's hover/highlight state. */
export type ProjectAccent = "primary" | "secondary" | "tertiary";

/**
 * Summary shape used for project cards (homepage + `/projects` grid).
 * `Project` extends this with the full case-study fields.
 */
export interface ProjectSummary {
  slug: string;
  title: string;
  summary: string;
  tags: readonly string[];
  accent: ProjectAccent;
}

/**
 * One titled block of a case study. Content is authored as structured data
 * (paragraphs + optional bullet list) rather than markdown — type-safe and
 * dependency-free, rendered via prose styling.
 */
export interface CaseStudySection {
  paragraphs: readonly string[];
  bullets?: readonly string[];
}

/**
 * Full project case study backing `/projects/[slug]`. Data lives in the repo
 * as typed objects (`src/content/projects`) — no CMS, no async.
 */
export interface Project extends ProjectSummary {
  /** Contribution/role, e.g. "Solo developer", "Frontend lead". */
  role: string;
  /** Year (or range) the work shipped, e.g. "2024". */
  year: string;
  problem: CaseStudySection;
  approach: CaseStudySection;
  tradeoffs: CaseStudySection;
  outcome: CaseStudySection;
  /** Live site URL — the link renders only when present. */
  liveUrl?: string;
  /** Public repo URL — the link renders only when present. */
  githubUrl?: string;
}
