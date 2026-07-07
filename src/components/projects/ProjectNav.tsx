import type { Project } from "@/types/project";
import Link from "next/link";

interface ProjectNavProps {
  prev?: Project;
  next?: Project;
}

const linkClasses =
  "group flex flex-col gap-1 rounded-lg border border-border bg-bg-elevated p-5 transition-colors duration-150 hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base";

/** Previous/next project navigation shown at the foot of a case study. */
export function ProjectNav({ prev, next }: ProjectNavProps) {
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Project navigation"
      className="mt-16 grid gap-4 border-t border-border pt-8 sm:grid-cols-2"
    >
      {prev ? (
        <Link href={`/projects/${prev.slug}`} className={linkClasses}>
          <span className="text-sm text-text-muted">← Previous</span>
          <span className="font-semibold text-text-primary group-hover:text-brand">{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={`/projects/${next.slug}`} className={`${linkClasses} sm:text-right`}>
          <span className="text-sm text-text-muted">Next →</span>
          <span className="font-semibold text-text-primary group-hover:text-brand">{next.title}</span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
