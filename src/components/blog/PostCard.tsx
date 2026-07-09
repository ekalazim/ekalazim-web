import { formatDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import type { PostSummary } from "@/types/post";
import Link from "next/link";

interface PostCardProps {
  post: PostSummary;
  className?: string;
}

/** Post summary card used in `LatestPosts` and the `/blog` list. */
export function PostCard({ post, className }: PostCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      aria-label={`Read “${post.title}”`}
      className={cn(
        "group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base",
        className,
      )}
    >
      <article className="h-full rounded-lg border border-border bg-bg-elevated p-6 transition-all duration-200 group-hover:border-tertiary-accent group-hover:scale-[1.02]">
        <p className="text-xs text-text-muted">
          {formatDate(post.publishedAt)}
          {post.readingTime ? ` · ${post.readingTime} min read` : null}
        </p>
        <h3 className="mt-2 text-xl font-semibold text-text-primary">{post.title}</h3>
        <p className="mt-2 text-sm text-text-secondary">{post.excerpt}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-tertiary-muted px-3 py-1 text-xs font-medium text-tertiary-text"
            >
              {tag}
            </li>
          ))}
        </ul>
      </article>
    </Link>
  );
}
