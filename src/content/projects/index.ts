import type { Project } from "@/types/project";

/**
 * Project case studies. Static, typed, in-repo — no CMS (see
 * `.claude/patterns/data-fetching.md` §"Project Data").
 *
 * NOTE: The problem/approach/tradeoffs/outcome copy below is senior-quality
 * DRAFT copy grounded in the PRD's technical framing. Haikal should refine the
 * specifics (metrics, dates, links) before this ships publicly.
 *
 * Order here is the canonical order used for the grid and prev/next nav.
 */
export const projects: Project[] = [
  {
    slug: "moosanclub",
    title: "MoosanClub",
    summary:
      "Production e-commerce platform with server-side rendering, authentication, Stripe payments, and a hand-rolled request cache.",
    tags: ["Next.js", "TypeScript", "Stripe", "SSR", "PostgreSQL"],
    accent: "primary",
    role: "Lead frontend engineer",
    year: "2024",
    liveUrl: "https://moosanclub.com",
    problem: {
      paragraphs: [
        "MoosanClub needed a storefront that felt instant on first load and stayed correct under real traffic: authenticated carts, live inventory, and Stripe checkout that could never double-charge. The earlier build leaned entirely on client-side fetching, so the first paint was a spinner and search engines saw an empty shell.",
      ],
      bullets: [
        "First contentful paint gated behind a client-side data waterfall",
        "Cart and inventory state drifting out of sync across tabs",
        "No server-rendered product pages for SEO or social previews",
      ],
    },
    approach: {
      paragraphs: [
        "I rebuilt the product and category pages as server-rendered routes so the meaningful content ships in the first HTML response, then hydrated only the interactive islands — cart, quantity steppers, checkout.",
        "Rather than pull in a heavy data-fetching dependency, I wrote a small SWR-style cache keyed by request, with revalidation on focus and mutation. It kept the client bundle lean while giving carts optimistic updates that reconcile against the server.",
      ],
      bullets: [
        "SSR product/category pages; interactive islands hydrated selectively",
        "Hand-rolled stale-while-revalidate cache — no extra runtime dependency",
        "Stripe checkout with idempotency keys to make retries safe",
      ],
    },
    tradeoffs: {
      paragraphs: [
        "Writing the cache by hand meant owning invalidation logic that a library would hand you for free. The payoff was a materially smaller bundle and full control over revalidation timing; the cost was more tests and a higher bar for onboarding new contributors.",
        "Server-rendering everything shifted load onto the origin, so I had to be deliberate about caching headers and which routes could be statically generated versus rendered per request.",
      ],
    },
    outcome: {
      paragraphs: [
        "Product pages went from a spinner-first experience to server-rendered content on first byte, and checkout reliability improved once retries became idempotent. The lean cache kept the JavaScript budget well under the target while still feeling live.",
      ],
      bullets: [
        "Server-rendered content on first response across the catalogue",
        "Idempotent checkout — retries no longer risk double charges",
        "Client bundle kept small by avoiding a data-fetching dependency",
      ],
    },
  },
  {
    slug: "hoopripple",
    title: "HoopRipple",
    summary:
      "Affiliate member portal built with TanStack Query, custom authentication, and idempotent request handling for money-moving actions.",
    tags: ["React", "TanStack Query", "Auth", "TypeScript"],
    accent: "secondary",
    role: "Frontend engineer",
    year: "2024",
    problem: {
      paragraphs: [
        "HoopRipple's members track referrals and payouts, so the portal handles actions that move money — the kind that must never fire twice, even on a flaky connection or an impatient double-click. The portal also needed session handling that degraded gracefully rather than logging people out mid-task.",
      ],
      bullets: [
        "Payout and referral actions vulnerable to accidental duplication",
        "Session expiry interrupting members in the middle of a flow",
        "Server and client state drifting after mutations",
      ],
    },
    approach: {
      paragraphs: [
        "I used TanStack Query as the server-state layer so lists, balances, and referral trees share a single cache with predictable invalidation after each mutation. On top of it I built a custom auth flow with silent token refresh, so sessions renew in the background instead of bouncing members to a login screen.",
        "Every money-moving request carries a client-generated idempotency key, so a retry — whether from the user or an automatic one — collapses to a single server-side effect.",
      ],
      bullets: [
        "TanStack Query for cache, invalidation, and optimistic updates",
        "Custom auth with silent refresh for uninterrupted sessions",
        "Idempotency keys on every mutating request",
      ],
    },
    tradeoffs: {
      paragraphs: [
        "A custom auth flow meant carrying the security burden that an off-the-shelf provider would absorb — token storage, refresh races, and revocation all had to be reasoned through and tested. It was the right call for the portal's specific session behaviour, but it demanded rigour.",
        "Optimistic updates make the UI feel instant but add reconciliation paths for the rare failure; I kept those explicit rather than hiding them.",
      ],
    },
    outcome: {
      paragraphs: [
        "Members can move through referral and payout flows without being interrupted by session expiry, and duplicate submissions no longer produce duplicate effects. The shared query cache kept the UI consistent after every mutation without manual refetch plumbing.",
      ],
      bullets: [
        "Duplicate-safe money-moving actions via idempotency keys",
        "Background session refresh — no mid-task logouts",
        "Consistent UI after mutations from a single shared cache",
      ],
    },
  },
  {
    slug: "affiliscale-admin",
    title: "Affiliscale Admin",
    summary:
      "Multi-tenant admin dashboard built in a monorepo with an AI-assisted development workflow and shared UI packages.",
    tags: ["Monorepo", "Next.js", "Multi-tenant", "TypeScript"],
    accent: "tertiary",
    role: "Solo developer",
    year: "2025",
    problem: {
      paragraphs: [
        "Affiliscale operates across multiple tenants, each needing an isolated view of their own data behind one admin surface. As a solo developer I needed a codebase that let me ship features across shared and tenant-specific packages without duplicating UI or leaking one tenant's data into another's view.",
      ],
      bullets: [
        "Strict data isolation between tenants on a shared admin surface",
        "UI and logic reused across packages without copy-paste drift",
        "One developer maintaining breadth across the whole system",
      ],
    },
    approach: {
      paragraphs: [
        "I structured the project as a monorepo: a shared design-system package, shared data-access utilities, and thin app layers per surface. Tenant scoping lives in the data layer so every query is constrained by tenant at the source, not patched per screen.",
        "To hold quality while working solo, I leaned on an AI-assisted workflow — using it to scaffold repetitive CRUD screens and review diffs — while keeping architecture, data-isolation logic, and final judgement firmly hand-owned.",
      ],
      bullets: [
        "Monorepo with shared design-system and data-access packages",
        "Tenant scoping enforced in the data layer, not per screen",
        "AI-assisted scaffolding with human-owned architecture and review",
      ],
    },
    tradeoffs: {
      paragraphs: [
        "A monorepo adds tooling overhead — shared build config, versioning discipline, and careful boundaries between packages — that only pays off once enough is genuinely shared. For a multi-tenant admin it paid off quickly; for a smaller app it would have been overkill.",
        "AI-assisted scaffolding accelerates the boilerplate but makes disciplined review non-negotiable: generated code is a starting point, never the final word, especially anywhere near tenant isolation.",
      ],
    },
    outcome: {
      paragraphs: [
        "The shared packages kept UI and data access consistent across tenants while the data-layer scoping made isolation the default rather than a per-screen concern. The AI-assisted workflow let a single developer sustain a surface that would normally need a small team.",
      ],
      bullets: [
        "Tenant isolation enforced by default at the data layer",
        "Consistent UI across surfaces from shared packages",
        "Solo-maintainable breadth via an AI-assisted workflow",
      ],
    },
  },
  {
    slug: "ekalazim-com",
    title: "ekalazim.com",
    summary:
      "This portfolio — a working demonstration of senior frontend engineering: Next.js 15, a hand-tuned design system, and a strict performance budget.",
    tags: ["Next.js 15", "React Server Components", "Tailwind v4", "Design tokens"],
    accent: "primary",
    role: "Designer & developer",
    year: "2026",
    liveUrl: "https://ekalazim.com",
    githubUrl: "https://github.com/haikalazim/ekalazim-web",
    problem: {
      paragraphs: [
        "A portfolio for a frontend engineer is itself the strongest sample of work — reviewed line by line by hiring panels. It had to look distinctive rather than templated, stay fast enough to pass a strict Lighthouse budget, and prove architectural intent in every decision, all while remaining trivial to extend phase by phase.",
      ],
      bullets: [
        "The code is public and read as a hiring signal",
        "Distinctive brand without sacrificing performance or accessibility",
        "A structure that scales cleanly from foundation to blog to projects",
      ],
    },
    approach: {
      paragraphs: [
        "I built on Next.js 15's App Router with Server Components as the default, dropping to client components only for genuinely interactive islands — the theme toggle, mobile nav, and tag filter. Every visual value flows through a design-token system in CSS variables, so light and dark modes are matched-mood expressions rather than a mechanical inversion.",
        "Rendering strategy is deliberate per route: static generation for stable pages, incremental regeneration for the Notion-backed blog. Framer Motion is lazy-loaded, and the whole thing is linted and formatted with Biome to keep the codebase consistent.",
      ],
      bullets: [
        "Server Components by default; client islands only where needed",
        "Three-accent design-token system shared across light and dark",
        "Per-route rendering strategy (SSG / ISR) chosen intentionally",
      ],
    },
    tradeoffs: {
      paragraphs: [
        "Holding a strict performance budget means saying no to convenient dependencies and animation-heavy flourishes that would blow the JavaScript budget. The discipline shows up as restraint — accents used sparingly, motion reserved for moments that earn it.",
        "A token-first system takes more upfront design work than hardcoding values, but it makes theming and future redesigns a change in one place instead of a hunt across components.",
      ],
    },
    outcome: {
      paragraphs: [
        "The site ships as a static, accessible, token-driven build that holds its performance budget while carrying a warm, intentional brand. Just as importantly, the architecture makes each subsequent phase — blog, richer projects, contact — an additive step rather than a rewrite.",
      ],
      bullets: [
        "Lighthouse performance held to the project's ≥95 target",
        "Accessible by default: keyboard-navigable, visible focus, semantic landmarks",
        "Phase-friendly architecture that extends without rework",
      ],
    },
  },
];
