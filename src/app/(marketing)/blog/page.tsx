import { BlogExplorer } from "@/components/blog/BlogExplorer";
import { getAllPosts } from "@/lib/notion";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = buildMetadata({
  title: "Blog",
  description:
    "Technical writing on frontend engineering, performance, and accessibility by Haikal Azim Abu Bakar.",
  path: "/blog",
});

// ISR: reflect new Notion publishes within 60 seconds.
export const revalidate = 60;

/**
 * Blog index — ISR. Posts are sourced from Notion (`src/lib/notion.ts`); the
 * interactive grid (tag filter with URL sync) is a client island wrapped in
 * Suspense, required because it reads `useSearchParams`. On a Notion failure
 * `getAllPosts` returns `[]` and the explorer shows an empty state.
 */
export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div className="mx-auto max-w-page px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-text-primary">Blog</h1>
      <p className="mt-4 max-w-content text-lg text-text-secondary">
        Writing on frontend engineering, performance, and accessibility — the decisions behind the work.
      </p>

      <Suspense fallback={null}>
        <BlogExplorer posts={posts} />
      </Suspense>
    </div>
  );
}
