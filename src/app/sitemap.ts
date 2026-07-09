import { siteConfig } from "@/config/site";
import { getAllPosts } from "@/lib/notion";
import { getAllProjectSlugs } from "@/lib/projects";
import type { MetadataRoute } from "next";

const staticRoutes = ["", "/about", "/projects", "/blog", "/now", "/contact"] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const projectRoutes = getAllProjectSlugs().map((slug) => `/projects/${slug}`);
  const posts = await getAllPosts();
  const postRoutes = posts.map((post) => `/blog/${post.slug}`);

  return [...staticRoutes, ...projectRoutes, ...postRoutes].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified,
  }));
}
