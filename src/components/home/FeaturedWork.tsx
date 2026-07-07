import { ProjectCard } from "@/components/projects/ProjectCard";
import { getAllProjects } from "@/lib/projects";
import Link from "next/link";

/** Homepage section showcasing the first 3 project case studies. */
export function FeaturedWork() {
  const featuredProjects = getAllProjects().slice(0, 3);

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
