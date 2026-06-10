# Pattern: Routing

Reference this file before creating any page, layout, or route.

---

## App Router Structure

This project uses Next.js 15 App Router exclusively.
No Pages Router. No mixing of conventions.

---

## Route Groups

```
src/app/
├── (marketing)/        → Homepage, About, Projects, Contact, Now
│                         Route group — no URL segment added
├── blog/               → Blog list and detail pages
│                         Separate from (marketing) — different layout
├── api/                → API routes (revalidation webhook, etc.)
└── layout.tsx          → Root layout — applies to all routes
```

**Why route groups:** The marketing pages share one layout (full nav + footer).
The blog detail pages may have a narrower content layout with reading progress.
Route groups let you apply different layouts without affecting the URL.

---

## File Conventions

```
page.tsx          → Renders the page (required for a route to exist)
layout.tsx        → Wraps children — persists across navigations
loading.tsx       → Shown while page.tsx suspends
error.tsx         → Shown when page.tsx throws
not-found.tsx     → Shown when notFound() is called
template.tsx      → Like layout but remounts on navigation
route.ts          → API route handler (GET, POST, etc.)
```

**Only create files you actually need.** Not every route needs all of them.

---

## Page File Structure

```tsx
// src/app/(marketing)/projects/[slug]/page.tsx

import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getProjectBySlug, getAllProjectSlugs } from "@/lib/projects"
import { generateProjectMetadata } from "@/lib/seo"
import { ProjectCaseStudy } from "@/components/projects/ProjectCaseStudy"

// 1. generateStaticParams — required for SSG dynamic routes
export async function generateStaticParams() {
  const slugs = getAllProjectSlugs()
  return slugs.map(slug => ({ slug }))
}

// 2. generateMetadata — required for SEO
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) return {}
  return generateProjectMetadata(project)
}

// 3. Page component — default export (Next.js requirement)
export default async function ProjectPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) notFound()

  return <ProjectCaseStudy project={project} />
}
```

**Rules:**
- `generateStaticParams` is required for all `[slug]` pages with SSG
- `generateMetadata` is required on every page (never skip SEO)
- Default export only on page files — everywhere else use named exports
- `params` is now a Promise in Next.js 15 — always `await params`

---

## ISR Configuration

For blog pages, ISR is configured via `revalidate`:

```tsx
// src/app/blog/[slug]/page.tsx

// This exports tells Next.js to use ISR with 60s revalidation
export const revalidate = 60

export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  // fetch from Notion — will be cached and revalidated every 60s
  const post = await getPostBySlug(slug)
  if (!post) notFound()
  return <BlogPost post={post} />
}
```

**Never use `export const dynamic = "force-dynamic"`** unless absolutely
necessary (kills caching entirely). Use `revalidate` instead.

---

## URL-Synced State (Filters, Pagination)

Client-side state that should survive page refresh must live in the URL.
Use `useSearchParams` and `useRouter` — never `useState` for filters.

```tsx
"use client"
// "use client" required — uses useSearchParams and useRouter

import { useSearchParams, useRouter, usePathname } from "next/navigation"

export function TagFilter({ tags }: { tags: string[] }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const activeTag = searchParams.get("tag")

  function handleTagClick(tag: string) {
    const params = new URLSearchParams(searchParams)
    if (tag === activeTag) {
      params.delete("tag")
    } else {
      params.set("tag", tag)
    }
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div>
      {tags.map(tag => (
        <button
          key={tag}
          onClick={() => handleTagClick(tag)}
          className={cn(
            "tag-base-styles",
            activeTag === tag && "tag-active-styles"
          )}
        >
          {tag}
        </button>
      ))}
    </div>
  )
}
```

---

## Navigation

Navigation config lives in `src/config/navigation.ts`.
Never hardcode nav links in layout files.

```ts
// src/config/navigation.ts
export const navigation = [
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const
```

---

## Link vs Button

```tsx
// Navigation between pages → next/link
import Link from "next/link"
<Link href="/projects">View Projects</Link>

// External links → next/link with target
<Link href="https://github.com/..." target="_blank" rel="noopener noreferrer">

// Actions that don't navigate → button
<button onClick={handleSubmit}>Send Message</button>

// Never use <a> directly — always next/link or button
```

---

## Redirects

```tsx
// In a Server Component / page
import { redirect } from "next/navigation"
redirect("/home")

// 404
import { notFound } from "next/navigation"
notFound()

// Never use router.push for server-side redirects
// Never use window.location
```

---

## API Routes

API routes live in `src/app/api/`. Use only for:
- Webhook handlers (Notion revalidation)
- Anything that can't be a Server Action

```ts
// src/app/api/revalidate/route.ts
import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidate-secret")
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  revalidatePath("/blog")
  return NextResponse.json({ revalidated: true })
}
```

For form submissions and mutations, use Server Actions instead of API routes.
See `.claude/patterns/server-actions.md`.
