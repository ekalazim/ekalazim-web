import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = buildMetadata({
  title: "Blog",
  description: "Technical writing by Haikal Azim Abu Bakar.",
  path: "/blog",
});

/**
 * Blog index placeholder. Real posts are sourced from Notion via
 * `notion-to-md` starting in Phase 3 per `.claude/patterns/data-fetching.md`.
 */
export default function BlogPage() {
  return (
    <div className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-text-primary">Blog</h1>
      <p className="mt-4 text-lg text-text-secondary">
        The blog is coming soon. Posts will cover frontend engineering, performance, and accessibility.
      </p>
    </div>
  );
}
