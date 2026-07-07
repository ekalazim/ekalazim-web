import { siteConfig } from "@/config/site";
import { env } from "@/lib/env";
import type { Project } from "@/types/project";
import type { Metadata } from "next";

interface PageMetadataOptions {
  /** Page-specific title. Combined with the site title template. */
  title: string;
  /** Page-specific description for search engines and social previews. */
  description: string;
  /** Path relative to the site root, e.g. "/about". Defaults to "/". */
  path?: string;
}

/**
 * Base metadata applied via the root layout. Individual pages should use
 * `buildMetadata()` to extend this with page-specific title/description.
 */
export const baseMetadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: siteConfig.title,
    template: `%s — ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  authors: [{ name: siteConfig.author, url: siteConfig.url }],
  creator: siteConfig.author,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
};

/**
 * Builds page-level metadata for `generateMetadata`, layering a page title,
 * description, and canonical path onto `baseMetadata`.
 */
export function buildMetadata({ title, description, path = "/" }: PageMetadataOptions): Metadata {
  const url = new URL(path, env.NEXT_PUBLIC_SITE_URL).toString();

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/**
 * Metadata for a project case-study page. The per-project OG image is served
 * by the `opengraph-image.tsx` route segment, so no `images` field is set here
 * — Next.js associates it automatically.
 */
export function generateProjectMetadata(project: Project): Metadata {
  return buildMetadata({
    title: project.title,
    description: project.summary,
    path: `/projects/${project.slug}`,
  });
}

/** JSON-LD shape shared by the structured-data builders below. */
export type JsonLd = Record<string, unknown>;

/** `CreativeWork` structured data for a project detail page. */
export function projectJsonLd(project: Project): JsonLd {
  const url = new URL(`/projects/${project.slug}`, env.NEXT_PUBLIC_SITE_URL).toString();
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    url,
    keywords: project.tags.join(", "),
    author: {
      "@type": "Person",
      name: siteConfig.author,
      url: siteConfig.url,
    },
    ...(project.liveUrl ? { sameAs: [project.liveUrl] } : {}),
  };
}

/** `BreadcrumbList` structured data from ordered `{ name, path }` items. */
export function breadcrumbJsonLd(items: readonly { name: string; path: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.path, env.NEXT_PUBLIC_SITE_URL).toString(),
    })),
  };
}
