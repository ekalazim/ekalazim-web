import { siteConfig } from "@/config/site";
import { formatDate } from "@/lib/format-date";
import { getAllPosts } from "@/lib/notion";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Prerender one OG image per post at build time (summary only — no block fetch).
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

/**
 * Per-post OG image. `next/og` renders via Satori, which supports no CSS
 * variables or Tailwind — values below are inline literals mirroring the brand
 * tokens in `src/styles/globals.css` (light-mode). The blog uses the tertiary
 * (violet) accent.
 */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = await getAllPosts();
  const post = posts.find((p) => p.slug === slug);
  const title = post?.title ?? "Blog";
  const meta = post ? formatDate(post.publishedAt) : siteConfig.author;
  const tags = post?.tags.slice(0, 4) ?? [];

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#FFFBF5",
        padding: "80px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "120px",
          height: "8px",
          backgroundColor: "#7C6FF0",
          borderRadius: "9999px",
        }}
      />

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 28, color: "#6B5D4F", marginBottom: 16 }}>Article</div>
        <div style={{ fontSize: 72, fontWeight: 700, color: "#1A1614", lineHeight: 1.1 }}>{title}</div>
        <div style={{ display: "flex", marginTop: 24, fontSize: 28, color: "#6B5D4F" }}>{meta}</div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div style={{ display: "flex", gap: 12 }}>
          {tags.map((tag) => (
            <div
              key={tag}
              style={{
                display: "flex",
                padding: "8px 20px",
                fontSize: 22,
                color: "#6B5D4F",
                border: "2px solid #EFE6D8",
                borderRadius: "9999px",
              }}
            >
              {tag}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", fontSize: 26, fontWeight: 600, color: "#1A1614" }}>
          {siteConfig.author}
        </div>
      </div>
    </div>,
    { ...size },
  );
}
