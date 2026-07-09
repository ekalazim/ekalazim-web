"use client";
// "use client" — reads the active tag from the URL via useSearchParams.

import { PostCard } from "@/components/blog/PostCard";
import { PostTagFilter } from "@/components/blog/PostTagFilter";
import type { PostSummary } from "@/types/post";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

interface BlogExplorerProps {
  posts: readonly PostSummary[];
}

/**
 * Client shell for the `/blog` list: derives the topic tags, reads the active
 * tag from the URL, filters the (already-loaded) posts, and renders the filter,
 * the card grid, and an empty state. Must be rendered inside a `<Suspense>`
 * boundary because `useSearchParams` opts the subtree into client rendering.
 */
export function BlogExplorer({ posts }: BlogExplorerProps) {
  const searchParams = useSearchParams();
  const activeTag = searchParams.get("tag");

  const tags = useMemo(
    () => [...new Set(posts.flatMap((post) => post.tags))].sort((a, b) => a.localeCompare(b)),
    [posts],
  );

  const visiblePosts = activeTag === null ? posts : posts.filter((post) => post.tags.includes(activeTag));

  return (
    <div className="mt-8">
      {tags.length > 0 ? <PostTagFilter tags={tags} activeTag={activeTag} /> : null}

      {visiblePosts.length === 0 ? (
        <p className="mt-10 text-text-secondary">
          {activeTag ? `No posts tagged “${activeTag}” yet.` : "No posts published yet — check back soon."}
        </p>
      ) : (
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visiblePosts.map((post) => (
            <li key={post.slug}>
              <PostCard post={post} className="h-full" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
