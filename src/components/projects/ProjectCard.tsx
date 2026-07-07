import { cn } from "@/lib/utils";
import type { ProjectAccent, ProjectSummary } from "@/types/project";
import Link from "next/link";

interface ProjectCardProps {
  project: ProjectSummary;
  className?: string;
}

const ACCENT_BORDER: Record<ProjectAccent, string> = {
  primary: "group-hover:border-brand",
  secondary: "group-hover:border-secondary-accent",
  tertiary: "group-hover:border-tertiary-accent",
};

const ACCENT_TAG: Record<ProjectAccent, string> = {
  primary: "bg-brand-muted text-brand-text",
  secondary: "bg-secondary-muted text-secondary-text",
  tertiary: "bg-tertiary-muted text-tertiary-text",
};

/** Project summary card used in `FeaturedWork` and the `/projects` grid. */
export function ProjectCard({ project, className }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      aria-label={`${project.title} — case study`}
      className={cn(
        "group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base",
        className,
      )}
    >
      <article
        className={cn(
          "h-full rounded-lg border border-border bg-bg-elevated p-6 transition-all duration-200 group-hover:scale-[1.02]",
          ACCENT_BORDER[project.accent],
        )}
      >
        <h3 className="text-xl font-semibold text-text-primary">{project.title}</h3>
        <p className="mt-2 text-sm text-text-secondary">{project.summary}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className={cn("rounded-full px-3 py-1 text-xs font-medium", ACCENT_TAG[project.accent])}
            >
              {tag}
            </li>
          ))}
        </ul>
      </article>
    </Link>
  );
}
