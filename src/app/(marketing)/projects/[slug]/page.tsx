import { ProjectCaseStudy } from "@/components/projects/ProjectCaseStudy";
import { JsonLd } from "@/components/shared/JsonLd";
import { getAdjacentProjects, getAllProjectSlugs, getProjectBySlug } from "@/lib/projects";
import { breadcrumbJsonLd, generateProjectMetadata, projectJsonLd } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return generateProjectMetadata(project);
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  const { prev, next } = getAdjacentProjects(slug);

  return (
    <>
      <JsonLd data={projectJsonLd(project)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Projects", path: "/projects" },
          { name: project.title, path: `/projects/${project.slug}` },
        ])}
      />
      <ProjectCaseStudy project={project} prev={prev} next={next} />
    </>
  );
}
