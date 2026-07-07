"use client";
// "use client" — reads the active tag from the URL via useSearchParams.

import { ProjectCard } from "@/components/projects/ProjectCard";
import { TechTagFilter } from "@/components/projects/TechTagFilter";
import type { ProjectSummary } from "@/types/project";
import { useSearchParams } from "next/navigation";

interface ProjectsExplorerProps {
  projects: readonly ProjectSummary[];
  tags: readonly string[];
}

/**
 * Client shell for the `/projects` grid: reads the active tag from the URL,
 * filters the (already-loaded) project list, and renders the tag filter, the
 * card grid, and an empty state. Must be rendered inside a `<Suspense>`
 * boundary because `useSearchParams` opts the subtree into client rendering.
 */
export function ProjectsExplorer({ projects, tags }: ProjectsExplorerProps) {
  const searchParams = useSearchParams();
  const activeTag = searchParams.get("tag");

  const visibleProjects = activeTag === null ? projects : projects.filter((p) => p.tags.includes(activeTag));

  return (
    <div className="mt-8">
      <TechTagFilter tags={tags} activeTag={activeTag} />

      {visibleProjects.length === 0 ? (
        <p className="mt-10 text-text-secondary">No projects match “{activeTag}” yet.</p>
      ) : (
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProjects.map((project) => (
            <li key={project.slug}>
              <ProjectCard project={project} className="h-full" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
