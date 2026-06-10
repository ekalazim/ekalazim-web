import { siteConfig } from "@/config/site";
import { env } from "@/lib/env";
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
