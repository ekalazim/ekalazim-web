import { siteConfig } from "@/config/site";
import type { MetadataRoute } from "next";

// Extended with project/post detail routes via generateStaticParams in later phases.
const routes = ["", "/about", "/projects", "/blog", "/now", "/contact"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified,
  }));
}
