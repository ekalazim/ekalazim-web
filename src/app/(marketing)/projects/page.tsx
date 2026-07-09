import { ProjectsExplorer } from "@/components/projects/ProjectsExplorer";
import { getAllProjects, getAllTags } from "@/lib/projects";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = buildMetadata({
  title: "Projects",
  description: "Selected projects and case studies by Haikal Azim Abu Bakar.",
  path: "/projects",
});

/**
 * Projects index — SSG. Case-study data lives in the repo (`src/content/projects`).
 * The interactive grid (tag filter with URL sync) is a client island wrapped in
 * Suspense, required because it reads `useSearchParams`.
 */
export default function ProjectsPage() {
  const projects = getAllProjects();
  const tags = getAllTags();

  return (
    <div className="mx-auto max-w-page px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-text-primary">Projects</h1>
      <p className="mt-4 max-w-content text-lg text-text-secondary">
        A selection of production work and case studies — the problem, the approach, the tradeoffs, and how
        each one turned out.
      </p>

      <Suspense fallback={null}>
        <ProjectsExplorer projects={projects} tags={tags} />
      </Suspense>
    </div>
  );
}
