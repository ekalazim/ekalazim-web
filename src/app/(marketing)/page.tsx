import { FeaturedWork } from "@/components/home/FeaturedWork";
import { Hero } from "@/components/home/Hero";
import { LatestPosts } from "@/components/home/LatestPosts";
import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  ...buildMetadata({
    title: siteConfig.title,
    description: siteConfig.description,
    path: "/",
  }),
  // Homepage uses the full site title verbatim, bypassing the "%s — Ekal Azim" template.
  title: { absolute: siteConfig.title },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.author,
  url: siteConfig.url,
  jobTitle: siteConfig.role,
  sameAs: [siteConfig.links.github, siteConfig.links.linkedin, siteConfig.links.twitter],
};

export default function HomePage() {
  return (
    <Container>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static, locally-defined JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <Hero />
      <FeaturedWork />
      <LatestPosts />
    </Container>
  );
}
