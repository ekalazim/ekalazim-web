import { formatDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import type { PostSummary } from "@/types/post";

interface PostCardProps {
  post: PostSummary;
  className?: string;
}

/** Post summary card used in `LatestPosts` and the `/blog` list. */
export function PostCard({ post, className }: PostCardProps) {
  return (
    <article className={cn("rounded-lg border border-border bg-bg-elevated p-6", className)}>
      <p className="text-xs text-text-muted">
        {formatDate(post.publishedAt)} · {post.readingTime} min read
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
  );
}
