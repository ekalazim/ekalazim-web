import { formatDate } from "@/lib/format-date";
import type { BlogPost } from "@/types/post";
import Link from "next/link";

interface ArticleHeaderProps {
  post: BlogPost;
}

/** Title block for a blog article: back link, title, meta, tags, optional cover. */
export function ArticleHeader({ post }: ArticleHeaderProps) {
  return (
    <header>
      <Link
        href="/blog"
        className="text-sm font-medium text-text-secondary transition-colors duration-150 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base rounded-sm"
      >
        ← All posts
      </Link>

      <div className="mt-6 h-1.5 w-14 rounded-full bg-tertiary-accent" />

      <h1 className="mt-6 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">{post.title}</h1>

      <p className="mt-4 text-sm text-text-muted">
        {formatDate(post.publishedAt)} · {post.readingTime} min read
      </p>

      {post.tags.length > 0 ? (
        <ul className="mt-5 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-tertiary-muted px-3 py-1 text-xs font-medium text-tertiary-text"
            >
              {tag}
            </li>
          ))}
        </ul>
      ) : null}

      {post.coverImage ? (
        // Notion-hosted cover URLs are signed and expire, so we skip next/image
        // optimization and render the source directly; ISR refetches a fresh URL.
        <img
          src={post.coverImage}
          alt={`Cover for “${post.title}”`}
          className="mt-8 aspect-2/1 w-full rounded-lg border border-border object-cover"
        />
      ) : null}
    </header>
  );
}
