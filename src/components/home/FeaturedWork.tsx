import { ProjectCard } from "@/components/projects/ProjectCard";
import type { ProjectSummary } from "@/types/project";
import Link from "next/link";

// Placeholder data — replaced by `src/lib/projects.ts` in Phase 2.
const featuredProjects: readonly ProjectSummary[] = [
  {
    slug: "moosanclub",
    title: "MoosanClub",
    summary:
      "Production e-commerce platform with SSR, authentication, Stripe payments, and a hand-rolled SWR cache.",
    tags: ["Next.js", "Stripe", "SSR"],
    accent: "primary",
  },
  {
    slug: "hoopripple",
    title: "HoopRipple",
    summary:
      "Affiliate member portal built with TanStack Query, custom auth, and idempotent request handling.",
    tags: ["TanStack Query", "Auth"],
    accent: "secondary",
  },
  {
    slug: "affiliscale-admin",
    title: "Affiliscale Admin",
    summary: "Multi-tenant admin dashboard built in a monorepo with an AI-assisted development workflow.",
    tags: ["Monorepo", "Admin"],
    accent: "tertiary",
  },
];

/** Homepage section showcasing 3 hand-picked project case studies. */
export function FeaturedWork() {
  return (
    <section className="py-16 sm:py-24">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight text-text-primary">Featured work</h2>
        <Link
          href="/projects"
          className="text-sm font-medium text-brand transition-colors duration-150 hover:text-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
        >
          View all projects
        </Link>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featuredProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
