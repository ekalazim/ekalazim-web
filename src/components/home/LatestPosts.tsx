import { PostCard } from "@/components/blog/PostCard";
import { getAllPosts } from "@/lib/notion";
import Link from "next/link";

/**
 * Homepage section showing the 3 most recent blog posts, sourced from Notion.
 * Renders nothing until at least one post is published, so the homepage never
 * shows an empty shelf.
 */
export async function LatestPosts() {
  const posts = (await getAllPosts()).slice(0, 3);

  if (posts.length === 0) return null;

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
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
