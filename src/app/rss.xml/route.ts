import { siteConfig } from "@/config/site";
import { env } from "@/lib/env";
import { getAllPosts } from "@/lib/notion";
import { Feed } from "feed";

// ISR: regenerate the feed at most once per 60 seconds, matching the blog.
export const revalidate = 60;

/**
 * RSS 2.0 feed at `/rss.xml`, built from published Notion posts. Returns a valid
 * (possibly empty) feed even when Notion is unreachable — `getAllPosts` yields
 * `[]` and the feed still validates.
 */
export async function GET() {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL;
  const posts = await getAllPosts();

  const feed = new Feed({
    title: `${siteConfig.name} — Blog`,
    description: siteConfig.description,
    id: siteUrl,
    link: siteUrl,
    language: "en",
    copyright: `© ${new Date().getFullYear()} ${siteConfig.author}`,
    feedLinks: { rss: `${siteUrl}/rss.xml` },
    author: {
      name: siteConfig.author,
      link: siteUrl,
    },
  });

  for (const post of posts) {
    const url = `${siteUrl}/blog/${post.slug}`;
    feed.addItem({
      title: post.title,
      id: url,
      link: url,
      description: post.excerpt,
      date: new Date(post.publishedAt),
      category: post.tags.map((name) => ({ name })),
    });
  }

  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
