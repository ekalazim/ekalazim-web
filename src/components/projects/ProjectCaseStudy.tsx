import { CaseStudySection } from "@/components/projects/CaseStudySection";
import { ProjectNav } from "@/components/projects/ProjectNav";
import { cn } from "@/lib/utils";
import type { Project, ProjectAccent } from "@/types/project";
import Link from "next/link";

interface ProjectCaseStudyProps {
  project: Project;
  prev?: Project;
  next?: Project;
}

const ACCENT_STRIPE: Record<ProjectAccent, string> = {
  primary: "bg-brand",
  secondary: "bg-secondary-accent",
  tertiary: "bg-tertiary-accent",
};

const ACCENT_TAG: Record<ProjectAccent, string> = {
  primary: "bg-brand-muted text-brand-text",
  secondary: "bg-secondary-muted text-secondary-text",
  tertiary: "bg-tertiary-muted text-tertiary-text",
};

const externalLinkClasses =
  "inline-flex items-center gap-1 text-sm font-medium text-brand transition-colors duration-150 hover:text-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base rounded-sm";

/** Full project case study rendered on `/projects/[slug]`. */
export function ProjectCaseStudy({ project, prev, next }: ProjectCaseStudyProps) {
  return (
    <article className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <Link
        href="/projects"
        className="text-sm font-medium text-text-secondary transition-colors duration-150 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base rounded-sm"
      >
        ← All projects
      </Link>

      <header className="mt-6">
        <div className={cn("h-1.5 w-14 rounded-full", ACCENT_STRIPE[project.accent])} />
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
          {project.title}
        </h1>
        <p className="mt-4 text-lg text-text-secondary">{project.summary}</p>

        <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-text-muted">
          <div className="flex gap-1.5">
            <dt className="sr-only">Role</dt>
            <dd>{project.role}</dd>
          </div>
          <div className="flex gap-1.5">
            <dt className="sr-only">Year</dt>
            <dd>{project.year}</dd>
          </div>
        </dl>

        <ul className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className={cn("rounded-full px-3 py-1 text-xs font-medium", ACCENT_TAG[project.accent])}
            >
              {tag}
            </li>
          ))}
        </ul>

        {(project.liveUrl || project.githubUrl) && (
          <div className="mt-6 flex flex-wrap gap-5">
            {project.liveUrl ? (
              <Link
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={externalLinkClasses}
              >
                Visit live site ↗
              </Link>
            ) : null}
            {project.githubUrl ? (
              <Link
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={externalLinkClasses}
              >
                View source ↗
              </Link>
            ) : null}
          </div>
        )}
      </header>

      <CaseStudySection title="Problem" section={project.problem} />
      <CaseStudySection title="Approach" section={project.approach} />
      <CaseStudySection title="Tradeoffs" section={project.tradeoffs} />
      <CaseStudySection title="Outcome" section={project.outcome} />

      <ProjectNav prev={prev} next={next} />
    </article>
  );
}
