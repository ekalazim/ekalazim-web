import { ArticleHeader } from "@/components/blog/ArticleHeader";
import { PostContent } from "@/components/blog/PostContent";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { JsonLd } from "@/components/shared/JsonLd";
import { getAllPosts, getPostBySlug } from "@/lib/notion";
import { articleJsonLd, breadcrumbJsonLd, generatePostMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

// ISR: reflect post edits within 60 seconds.
export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return generatePostMetadata(post);
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  return (
    <>
      <ReadingProgress />
      <JsonLd data={articleJsonLd(post)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />
      <article className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <ArticleHeader post={post} />
        <PostContent content={post.content} />
      </article>
    </>
  );
}
