# Pattern: Components

Reference this file before building any component.

---

## File Naming

- Component files: `PascalCase.tsx` — e.g. `ProjectCard.tsx`
- Hook files: `use-kebab-case.ts` — e.g. `use-reading-progress.ts`
- Utility files: `kebab-case.ts` — e.g. `reading-time.ts`
- One component per file. No barrel exports from component folders.

---

## Component Structure (Required Order)

```tsx
// 1. Imports — external, then internal, then styles
import { type FC } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { Project } from "@/types/project"

// 2. Types — always above the component
interface ProjectCardProps {
  project: Project
  featured?: boolean
  className?: string
}

// 3. Component — named export, never default (except Next.js pages)
export function ProjectCard({ project, featured = false, className }: ProjectCardProps) {
  return (
    <article className={cn("rounded-lg bg-elevated border border-border", className)}>
      {/* ... */}
    </article>
  )
}
```

---

## Server vs Client Components

**Default: Server Component.** No directive needed.

```tsx
// Server Component — can fetch data, access env vars, no hooks
export function BlogPostList({ posts }: { posts: Post[] }) {
  return <ul>{posts.map(p => <BlogPostCard key={p.id} post={p} />)}</ul>
}
```

**Add `"use client"` only when you need:**
- React hooks (`useState`, `useEffect`, `useRef`, etc.)
- Event handlers that need client state
- Browser APIs (`window`, `document`, `localStorage`)
- Third-party libraries that use the above

```tsx
"use client"
// Requires "use client" — uses useState and onChange event handler

import { useState } from "react"

interface TagFilterProps {
  tags: string[]
  onFilterChange: (tag: string | null) => void
}

export function TagFilter({ tags, onFilterChange }: TagFilterProps) {
  const [active, setActive] = useState<string | null>(null)
  // ...
}
```

**Rule:** Every `"use client"` directive must have a comment above it explaining why.

```tsx
// "use client" required — uses useScrollPosition hook and window.scrollY
"use client"
```

---

## Props Patterns

**Always define a Props interface.** Never inline types.

```tsx
// ✅ Correct
interface HeroProps {
  headline: string
  subtext: string
  ctaLabel: string
  ctaHref: string
}

export function Hero({ headline, subtext, ctaLabel, ctaHref }: HeroProps) {}

// ❌ Wrong — never inline
export function Hero({ headline, subtext }: { headline: string; subtext: string }) {}
```

**Optional props get defaults in destructuring, not in the interface:**
```tsx
interface CardProps {
  title: string
  featured?: boolean  // optional in interface
}

// Default set in destructuring
export function Card({ title, featured = false }: CardProps) {}
```

**className passthrough for composable components:**
```tsx
import { cn } from "@/lib/utils"

interface CardProps {
  className?: string
}

export function Card({ className }: CardProps) {
  return <div className={cn("base-styles", className)} />
}
```

---

## Required States for Data-Driven Components

Any component that receives async or external data must handle all three states:

```tsx
interface PostListProps {
  posts: Post[]         // data
  isLoading?: boolean   // loading state
  error?: string        // error state
}

export function PostList({ posts, isLoading, error }: PostListProps) {
  if (isLoading) return <PostListSkeleton />
  if (error) return <ErrorMessage message={error} />
  if (posts.length === 0) return <EmptyState message="No posts yet." />

  return <ul>{posts.map(p => <PostCard key={p.id} post={p} />)}</ul>
}
```

---

## Accessibility Checklist

Before a component is done, verify:

- [ ] Interactive elements (`button`, `a`, custom interactive) have visible focus rings
- [ ] Focus ring uses `focus-visible:ring-2 focus-visible:ring-brand-primary`
- [ ] Images have meaningful `alt` text (empty `alt=""` for decorative images)
- [ ] Form inputs are associated with `<label>` via `htmlFor` / `id`
- [ ] Icon-only buttons have `aria-label`
- [ ] Color is never the sole indicator of meaning
- [ ] Heading hierarchy is correct (h1 → h2 → h3, no skips)
- [ ] Landmark regions used where appropriate (`<main>`, `<nav>`, `<article>`, `<section>`)

---

## Animation Rules

**Use native CSS for simple transitions:**
```tsx
// Hover color, scale, opacity — always native CSS via Tailwind
<button className="transition-colors duration-150 hover:text-brand-primary">
```

**Use Framer Motion only for:**
- Page transitions
- Scroll-triggered reveal animations
- Complex orchestrated sequences

**Framer Motion must be dynamically imported:**
```tsx
// At the top of any file using Framer Motion
import dynamic from "next/dynamic"
const MotionDiv = dynamic(() => import("framer-motion").then(m => m.motion.div))
```

**Always respect reduced motion:**
```tsx
const variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
}

// In the component
<motion.div
  variants={variants}
  initial="hidden"
  animate="visible"
  transition={{ duration: 0.3 }}
/>
```

Add this to `globals.css`:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Component Grouping in `src/components/`

```
components/
├── ui/           → shadcn primitives only (Button, Input, Badge, etc.)
│                   Never modify these directly — extend via className
├── layout/       → Header, Footer, ThemeProvider, Container
├── blog/         → PostCard, ArticleHeader, ReadingProgress, RelatedPosts
├── projects/     → ProjectCard, ProjectCaseStudy, TechTag
├── home/         → Hero, FeaturedWork, LatestPosts
└── shared/       → ThemeToggle, SocialLinks, PageTransition, SectionHeading
```

If a component doesn't fit neatly into one group, put it in `shared/`.
If you're creating a new group, stop and check the PRD first.
