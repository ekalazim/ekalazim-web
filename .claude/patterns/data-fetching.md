# Pattern: Data Fetching

Reference this file before fetching any data from Notion or external APIs.

---

## Core Principle

All data fetching happens server-side. No client-side API calls to Notion.
The Notion API key must never reach the browser.

```
Browser → Next.js Server Component → Notion API
                                          ↓
Browser ← Static/ISR HTML ← Rendered component
```

---

## Notion Client Setup

The Notion client lives in `src/lib/notion.ts`.
All Notion interactions go through this file — never instantiate the client elsewhere.

```ts
// src/lib/notion.ts
import { Client } from "@notionhq/client"
import { NotionToMarkdown } from "notion-to-md"
import { env } from "@/lib/env"

// Single client instance — module-level singleton
export const notion = new Client({
  auth: env.NOTION_API_KEY,
})

export const n2m = new NotionToMarkdown({ notionClient: notion })
```

---

## Fetching Blog Post List

```ts
// src/lib/notion.ts

import type { BlogPost } from "@/types/notion"

export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const response = await notion.databases.query({
      database_id: env.NOTION_BLOG_DATABASE_ID,
      filter: {
        property: "Status",
        select: { equals: "Published" },
      },
      sorts: [
        { property: "Published Date", direction: "descending" },
      ],
    })

    return response.results.map(mapPageToBlogPost).filter(Boolean) as BlogPost[]
  } catch (error) {
    // Log to Sentry in production
    console.error("[Notion] Failed to fetch posts:", error)
    // Return empty array — ISR will serve the last successful build
    return []
  }
}
```

---

## Fetching Single Blog Post

```ts
// src/lib/notion.ts

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const response = await notion.databases.query({
      database_id: env.NOTION_BLOG_DATABASE_ID,
      filter: {
        and: [
          { property: "Slug", rich_text: { equals: slug } },
          { property: "Status", select: { equals: "Published" } },
        ],
      },
    })

    const page = response.results[0]
    if (!page) return null

    // Fetch the page blocks (article content)
    const mdBlocks = await n2m.pageToMarkdown(page.id)
    const markdown = n2m.toMarkdownString(mdBlocks)

    return {
      ...mapPageToBlogPost(page),
      content: markdown.parent,
    }
  } catch (error) {
    console.error("[Notion] Failed to fetch post:", error)
    return null
  }
}
```

---

## Mapping Notion Response to Types

Always map Notion's raw response to your own typed objects.
Never pass raw Notion API objects to components.

```ts
// src/lib/notion.ts

function mapPageToBlogPost(page: PageObjectResponse): BlogPost | null {
  try {
    const props = page.properties

    return {
      id: page.id,
      title: getTitle(props.Title),
      slug: getRichText(props.Slug),
      excerpt: getRichText(props.Excerpt),
      tags: getMultiSelect(props.Tags),
      publishedAt: getDate(props["Published Date"]),
      coverImage: getFile(props["Cover Image"]) ?? null,
      content: "", // filled separately when fetching single post
    }
  } catch {
    return null
  }
}

// Helper extractors — type-safe Notion property accessors
function getTitle(prop: PropertyItemObjectResponse): string {
  return prop.type === "title"
    ? prop.title.map(t => t.plain_text).join("")
    : ""
}

function getRichText(prop: PropertyItemObjectResponse): string {
  return prop.type === "rich_text"
    ? prop.rich_text.map(t => t.plain_text).join("")
    : ""
}

function getMultiSelect(prop: PropertyItemObjectResponse): string[] {
  return prop.type === "multi_select"
    ? prop.multi_select.map(s => s.name)
    : []
}

function getDate(prop: PropertyItemObjectResponse): string | null {
  return prop.type === "date" ? prop.date?.start ?? null : null
}

function getFile(prop: PropertyItemObjectResponse): string | null {
  if (prop.type !== "files") return null
  const file = prop.files[0]
  if (!file) return null
  return file.type === "external" ? file.external.url : file.file.url
}
```

---

## Using Fetch in Pages (ISR Pattern)

```tsx
// src/app/blog/page.tsx

// ISR: revalidate every 60 seconds
export const revalidate = 60

export default async function BlogPage() {
  // getAllPosts() returns [] on error — page still renders with empty state
  const posts = await getAllPosts()

  return <BlogPostList posts={posts} />
}
```

```tsx
// src/app/blog/[slug]/page.tsx

export const revalidate = 60

// Generates all slugs at build time for initial static pages
export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map(post => ({ slug: post.slug }))
}

export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) notFound()

  return <BlogPost post={post} />
}
```

---

## Error Handling Rules

1. **All Notion calls are wrapped in try/catch.** Never let a Notion error
   propagate to the page — return null or [] instead.

2. **Log errors with context.** Use `console.error("[Notion] context:", error)`
   in development. In production, Sentry captures these automatically.

3. **Graceful degradation.** If the list fetch fails, show an empty state.
   If a single post fetch fails, show a 404. The last successful ISR build
   is always served — the site never goes down due to a Notion API error.

4. **Never throw inside a data fetching function.** Always return null/[].

---

## Project Data (Static — No API)

Projects data lives in the repo as typed TypeScript objects.
No CMS, no API, no async needed. Just import and use.

```ts
// src/lib/projects.ts

import type { Project } from "@/types/project"
import { projects } from "@/content/projects"

export function getAllProjects(): Project[] {
  return projects
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find(p => p.slug === slug)
}

export function getAllProjectSlugs(): string[] {
  return projects.map(p => p.slug)
}
```

```ts
// src/content/projects/index.ts

import type { Project } from "@/types/project"

export const projects: Project[] = [
  {
    slug: "moosanclub",
    title: "MoosanClub",
    summary: "Production e-commerce platform with SSR, JWT auth, and Stripe.",
    tags: ["Next.js", "NestJS", "TypeScript", "PostgreSQL", "Docker"],
    status: "production",
    // ...
  },
  // ...
]
```

---

## Reading Time

Calculated from content string — no external API needed.

```ts
// src/lib/reading-time.ts

export function calculateReadingTime(content: string): number {
  const WORDS_PER_MINUTE = 200
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))
}
```

---

## Environment Variable Access

Never access `process.env` directly. Always use `src/lib/env.ts`.

```ts
// src/lib/env.ts — single source of truth, validated at startup

import { z } from "zod"

const envSchema = z.object({
  NOTION_API_KEY: z.string().min(1),
  NOTION_BLOG_DATABASE_ID: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  RESEND_FROM_EMAIL: z.string().email(),
  CONTACT_RECIPIENT_EMAIL: z.string().email(),
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
})

export const env = envSchema.parse(process.env)
```

If a required env var is missing, the build fails immediately with a clear error.
This prevents silent runtime failures in production.
