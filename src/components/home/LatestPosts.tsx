import { PostCard } from "@/components/blog/PostCard";
import type { PostSummary } from "@/types/post";
import Link from "next/link";

// Placeholder data — replaced by Notion-backed fetching in Phase 3.
const latestPosts: readonly PostSummary[] = [
  {
    slug: "building-my-portfolio-as-a-technical-demo",
    title: "Building My Portfolio as a Technical Demo",
    excerpt:
      "Why this site demonstrates senior frontend engineering instead of just describing it — and the architecture decisions behind it.",
    publishedAt: "2026-06-01",
    readingTime: 8,
    tags: ["Architecture", "Meta"],
  },
  {
    slug: "why-i-built-my-own-swr-before-tanstack-query",
    title: "Why I Built My Own SWR Before Using TanStack Query",
    excerpt:
      "Lessons from MoosanClub: a hand-rolled cache with useRef guards and TTLs, and what it taught me before adopting TanStack Query.",
    publishedAt: "2026-05-15",
    readingTime: 10,
    tags: ["React", "Caching"],
  },
  {
    slug: "performance-budgets-that-actually-stick",
    title: "Performance Budgets That Actually Stick",
    excerpt: "How a Lighthouse CI gate and a 150KB bundle budget changed the way I review pull requests.",
    publishedAt: "2026-04-22",
    readingTime: 6,
    tags: ["Performance", "DX"],
  },
];

/** Homepage section showing the 3 most recent blog posts. */
export function LatestPosts() {
  return (
    <section className="py-16 sm:py-24">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight text-text-primary">Latest posts</h2>
        <Link
          href="/blog"
          className="text-sm font-medium text-brand transition-colors duration-150 hover:text-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
        >
          View all posts
        </Link>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {latestPosts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
