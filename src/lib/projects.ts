import { projects } from "@/content/projects";
import type { Project } from "@/types/project";

/** All projects in canonical order (grid + prev/next nav). */
export function getAllProjects(): Project[] {
  return projects;
}

/** A single project by slug, or `undefined` if none matches. */
export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/** All project slugs — used by `generateStaticParams`. */
export function getAllProjectSlugs(): string[] {
  return projects.map((p) => p.slug);
}

/** Unique tech tags across all projects, sorted, for the filter UI. */
export function getAllTags(): string[] {
  const tags = new Set<string>();
  for (const project of projects) {
    for (const tag of project.tags) {
      tags.add(tag);
    }
  }
  return Array.from(tags).sort((a, b) => a.localeCompare(b));
}

/** Previous/next projects relative to a slug, for case-study navigation. */
export function getAdjacentProjects(slug: string): {
  prev?: Project;
  next?: Project;
} {
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) return {};
  return {
    prev: index > 0 ? projects[index - 1] : undefined,
    next: index < projects.length - 1 ? projects[index + 1] : undefined,
  };
}
