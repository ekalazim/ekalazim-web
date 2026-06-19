import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = buildMetadata({
  title: "Projects",
  description: "Selected projects by Haikal Azim Abu Bakar.",
  path: "/projects",
});

/**
 * Projects index placeholder. Real project data and case study pages ship
 * in Phase 2 per the PRD §10 content structure.
 */
export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-text-primary">Projects</h1>
      <p className="mt-4 text-lg text-text-secondary">
        The full project index is coming soon. Check back shortly for case studies and write-ups.
      </p>
    </div>
  );
}
