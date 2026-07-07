import { siteConfig } from "@/config/site";
import { getAllProjectSlugs } from "@/lib/projects";
import type { MetadataRoute } from "next";

// Static routes. Blog post detail routes are added in Phase 3.
const staticRoutes = ["", "/about", "/projects", "/blog", "/now", "/contact"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const projectRoutes = getAllProjectSlugs().map((slug) => `/projects/${slug}`);

  return [...staticRoutes, ...projectRoutes].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified,
  }));
}
