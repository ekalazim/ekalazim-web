# Progress Log — ekalazim.com

This file tracks what was built, phase by phase, as a running record of the
project's evolution. Each entry summarizes what changed and why, organized by
phase and feature area. See `ekalazim-portfolio-prd.md` for the full spec and
`CLAUDE.md` for the conventions every change follows.

---

## Phase 1 — Foundation

**Status:** Code complete and verified locally. Live deploy + Lighthouse
baseline are pending (user-run, see `DEPLOY.md`).

### Scaffold & tooling
- Bootstrapped a Next.js 15 (`^15.5.4`, locked per `CLAUDE.md`) App Router
  project with TypeScript strict mode + `noUncheckedIndexedAccess`, `src/`
  layout, and the `@/*` import alias.
- Added Biome (`biome.json`) as the sole linter/formatter — recommended +
  a11y rules, organize-imports, 110-char width, double quotes.
- `package.json` scripts: `dev`, `build`, `start`, `lint`, `lint:fix`,
  `format`, `typecheck`, `test`, `test:watch`, `test:e2e`.
- pnpm-only workspace (`pnpm-workspace.yaml`), with `onlyBuiltDependencies`
  for Biome/esbuild postinstall scripts.
- `.gitignore` extended for Playwright artifacts (`/test-results`,
  `/playwright-report`, `/blob-report`, `/playwright/.cache`) and to keep
  `.env.example` tracked.

### Design tokens & typography
- `src/styles/globals.css` — full warm three-accent token system (coral
  primary, teal secondary, violet tertiary) for light (`:root`, default) and
  dark (`.dark`) modes, mapped into Tailwind v4 via `@theme inline`.
- Custom tokens: `max-w-content/page/wide` containers, `text-display`,
  `radius-sm/md/lg`, `--font-sans`/`--font-mono` bound to Geist variables.
- Base layer styles: body background/text from tokens, heading line-height
  1.1, body line-height 1.6, `prefers-reduced-motion` reset.
- `src/styles/prose.css` — minimal typography stub for future blog content
  (Phase 3).

### Fonts
- Self-hosted Geist Sans/Mono via the `geist` package, applied as CSS
  variables on `<html>` in `src/app/layout.tsx` — zero CLS, no FOUT.

### Lib & config
- `src/lib/env.ts` — Zod-validated env vars (`NEXT_PUBLIC_SITE_URL`); the
  only module that reads `process.env`.
- `src/lib/utils.ts` — `cn()` helper (`clsx` + `tailwind-merge`).
- `src/lib/seo.ts` — `baseMetadata` + `buildMetadata()` for per-page SEO
  (title template, OG/Twitter defaults, canonical URLs).
- `src/lib/format-date.ts` — human-readable date formatting for blog/posts.
- `src/config/site.ts` — site-wide identity (name, role, tagline,
  description, social links).
- `src/config/navigation.ts` — primary nav structure (About, Projects, Blog,
  Contact).
- `src/types/project.ts`, `src/types/post.ts` — shared types for project and
  blog post summaries (used by Phase 2/3 data).

### Layout shell & theming
- `ThemeProvider` (next-themes, `class` attribute, light default, system
  support) wraps the app in `src/app/layout.tsx`.
- `ThemeToggle` — client component cycling Light → Dark → System, persisted
  via next-themes, with accessible labels and visible focus states.
- `Header` (server component) with wordmark, desktop nav (`NavLinks`,
  `ThemeToggle`), and a `MobileNav` (hamburger menu) for narrow viewports.
- `Footer` with copyright, `/now` link, and `SocialLinks`.
- `Container` primitive for consistent page-width constraints.
- `(marketing)` route group layout renders `Header` + `<main>` + `Footer`
  for all marketing pages.

### UI primitives
- `src/components/ui/button.tsx` — hand-authored shadcn-style `Button` using
  `class-variance-authority` + Radix `Slot` (`asChild`), with `primary`
  (coral), `secondary` (teal outline), and `ghost` variants, all token-driven.

### Pages
- **Homepage** (`/`, SSG) — `Hero`, `FeaturedWork` (3 placeholder projects),
  `LatestPosts` (3 placeholder posts), and a JSON-LD `Person` schema.
- **About** (`/about`, SSG) — bio, current focus (links to `/now`), skills by
  category, experience, education, and a resume download link.
- **Now** (`/now`, SSG) — placeholder "what I'm working on" page, added so
  the footer's `/now` link isn't dead.
- **Contact** (`/contact`, SSG) — placeholder page with a `mailto:` link to
  the site email, added so the Hero CTA isn't dead; the full
  React Hook Form + Zod + Server Action flow ships in Phase 4.
- **Projects** (`/projects`, SSG) — placeholder index page so
  "View all projects" resolves; full project data and case studies ship in
  Phase 2.
- **Blog** (`/blog`, SSG) — placeholder index page so "View all posts"
  resolves; real Notion-backed posts ship in Phase 3.
- `not-found.tsx` (404) and `error.tsx` (client error boundary, renders
  `ErrorPage`, logs via `console.error` pending Sentry in Phase 4).

### Foundational SEO
- `src/app/sitemap.ts` — covers all Phase 1 routes (`/`, `/about`,
  `/projects`, `/blog`, `/now`, `/contact`).
- `src/app/robots.ts` — allows all crawlers, points at the sitemap.
- `src/app/opengraph-image.tsx` — default 1200×630 OG image via `next/og`
  (`ImageResponse`), using inline hex values as required by Satori (the one
  documented exception to the no-hardcoded-hex rule).
- `next.config.ts` — security headers (HSTS, X-Frame-Options,
  X-Content-Type-Options, Referrer-Policy, Permissions-Policy). CSP is
  deferred pending review of inline JSON-LD and next-themes scripts.

### Testing & CI
- `vitest.config.ts` + `tests/unit/utils.test.ts` — unit tests for `cn()`
  (3 tests, all passing).
- `playwright.config.ts` + `tests/e2e/smoke.spec.ts` — e2e smoke tests across
  `chromium` (desktop) and `mobile-chrome` (Pixel 7) projects:
  - Homepage renders with no console errors.
  - Homepage is responsive on mobile (mobile menu visible).
  - About page is reachable via nav (mobile-aware: opens the hamburger menu
    first when the nav is collapsed).
  - Theme toggle switches Light → Dark and persists across reload
    (mobile-aware for the same reason).
  - All 8 tests (4 tests × 2 projects) pass.
- `.github/workflows/ci.yml` — install, lint, typecheck, unit test, build.
- `.github/workflows/lighthouse.yml` — Lighthouse CI on PRs, gating
  Performance and Accessibility ≥ 0.95 for `/` and `/about`.

### Deploy
- `DEPLOY.md` — step-by-step checklist for the user to import the repo into
  Vercel, set `NEXT_PUBLIC_SITE_URL`, configure the `ekalazim.com` custom
  domain, and add Cloudflare DNS records (apex `A` + `www` `CNAME`,
  DNS-only). Includes post-deploy verification (domain resolves, Lighthouse
  on prod ≥ 95).

### Verification status
- `pnpm lint` — clean.
- `pnpm typecheck` — clean.
- `pnpm exec vitest run` — 3/3 unit tests pass.
- `pnpm exec playwright test --project=chromium --project=mobile-chrome` —
  8/8 e2e tests pass.
- `pnpm build` — production build succeeds.

### Known follow-ups
- `public/resume.pdf` does not exist yet — the About page's "Download resume"
  button links to `/resume.pdf`; add the actual file before launch.
- Live domain resolution and Lighthouse ≥ 95 on production are pending the
  user-run deploy steps in `DEPLOY.md`.
- `/projects`, `/blog`, `/now`, and `/contact` are intentionally minimal
  placeholders — full implementations land in Phases 2–4.

> **Update:** all three follow-ups above are resolved as of Phase 4 — see
> "Phase 1 follow-ups now resolved" under Phase 5.

---

## Phase 2 — Projects

**Status:** Complete. Shipped in `2ba40ee`.

### Project data & types
- `src/content/projects/index.ts` — 4 authored case studies (`moosanclub`,
  `hoopripple`, `affiliscale-admin`, `ekalazim-com`), each carrying the
  problem / approach / tradeoffs / outcome narrative the PRD requires.
- `src/types/project.ts` extended from the Phase 1 summary type to the full
  case-study shape.
- `src/lib/projects.ts` — `getAllProjects`, `getProjectBySlug`,
  `getAllProjectSlugs` (feeds `generateStaticParams`), `getAllTags` (sorted,
  deduped, for the filter UI), and `getAdjacentProjects` (prev/next nav).

### Pages & components
- **`/projects`** (SSG) — `ProjectsExplorer` wrapping a `ProjectCard` grid.
- **`/projects/[slug]`** (SSG + `generateStaticParams`) — `ProjectCaseStudy`
  composed of `CaseStudySection` blocks, with `ProjectNav` for prev/next.
- `TechTagFilter` — tag state lives in the URL (`?tag=`) via
  `useSearchParams`/`useRouter`, so filters are shareable and survive refresh
  (per `.claude/patterns/routing.md` §"URL-Synced State").
- `FeaturedWork` on the homepage rewired from placeholders to real data.

### SEO
- `src/app/(marketing)/projects/[slug]/opengraph-image.tsx` — unique 1200×630
  OG image per project via `next/og`.
- `src/components/shared/JsonLd.tsx` — reusable structured-data component.
- `src/lib/seo.ts` extended with project metadata builders; `sitemap.ts` now
  enumerates every project slug.

### Tests
- `tests/unit/projects.test.ts` — data-layer coverage.
- `tests/e2e/projects.spec.ts` — 3 tests (direct URL navigation, filter URL
  sync, refresh survival) across both Playwright projects.

---

## Phase 3 — Blog

**Status:** Complete. Shipped in `85205c9` (PR #3).

### Notion data layer
- `src/lib/notion.ts` — the only module that talks to Notion
  (`@notionhq/client` + `notion-to-md`). Queries `Status = Published`, sorts
  by `Published Date` descending, and maps every response into our own typed
  objects so the API key never reaches the browser.
- Degrades by design: with `NOTION_API_KEY` / `NOTION_BLOG_DATABASE_ID`
  unset, the list resolves to `[]` and a single post to `null` rather than
  failing the build — CI and fresh clones stay green without secrets.
- `src/lib/reading-time.ts` — word-count based reading estimate.
- `src/lib/env.ts` extended with the two optional Notion vars.

### Pages & components (ISR, 60s)
- **`/blog`** and **`/blog/[slug]`** both `export const revalidate = 60`,
  matching the rendering strategy table in `CLAUDE.md`.
- `BlogExplorer`, `PostCard`, `PostTagFilter` (URL-synced `?tag=`, same
  pattern as the projects filter), `ArticleHeader`, `PostContent`.
- `ReadingProgress` — fixed top progress bar, `requestAnimationFrame`
  throttled, hidden from assistive tech, static under `prefers-reduced-motion`.
- `LatestPosts` on the homepage rewired from placeholders to Notion data.
- `src/styles/prose.css` grown from the Phase 1 stub into full article
  typography (120 lines).

### RSS & SEO
- `src/app/rss.xml/route.ts` — RSS 2.0 via the `feed` package, `revalidate =
  60` to match the blog. Emits a valid (empty) feed when Notion is
  unreachable rather than erroring.
- `src/app/(marketing)/blog/[slug]/opengraph-image.tsx` — per-post OG images.
- `sitemap.ts` extended with post slugs.

### Tests
- `tests/unit/notion.test.ts`, `tests/unit/reading-time.test.ts`.
- `tests/e2e/blog.spec.ts` — 3 tests across both Playwright projects.

---

## Phase 4 — Contact + Quality

**Status:** Complete. Shipped in `4c1a283`, hardened in `1d7de83`.

### Contact form
- `src/lib/contact-schema.ts` — the Zod schema shared by client and server.
  It lives outside the action file because a `"use server"` module may only
  export async functions; exporting a runtime value from it breaks the
  client bundle.
- `src/components/shared/ContactForm.tsx` — React Hook Form + `zodResolver`,
  with the honeypot field.
- `src/actions/contact.ts` — Server Action in four steps: honeypot check
  (returns a fake success so bots never learn it's a trap) → server-side
  re-validation → IP rate limit → send.
- `src/lib/rate-limit.ts` — Upstash sliding window, 3 requests per hour per
  IP, prefix `portfolio:contact`. **Fails open** when credentials are unset.
- `src/lib/email.ts` — Resend send with `replyTo` set to the sender; logs
  instead of sending when unconfigured.
- `src/types/actions.ts` — shared `ActionResult` discriminated union.

### Security hardening (`1d7de83`, post-review)
- Rate-limit key prefers `x-real-ip` (platform-set) over the client-spoofable
  `x-forwarded-for`, falling back to its first entry.
- CR/LF stripped from the sender name before it's interpolated into the email
  subject — defense-in-depth against header-injection-style payloads.
- PII redacted from the unconfigured-email log line (no body, no sender).
- Dropped Sentry's `enableLogs` flag to avoid forwarding PII to logs.

### Error tracking
- `instrumentation.ts`, `instrumentation-client.ts`,
  `sentry.server.config.ts`, `sentry.edge.config.ts`, and a root
  `global-error.tsx`. Every entry point no-ops without
  `NEXT_PUBLIC_SENTRY_DSN`, so local and CI runs are unaffected.
- `src/app/error.tsx` now calls `Sentry.captureException` alongside the
  existing console log, closing the Phase 1 follow-up.

### Quality gates
- E2E suite grown to 14 tests × 2 Playwright projects: `smoke` (4),
  `projects` (3), `blog` (3), `contact` (4 — including honeypot rejection).
- `lighthouserc.json` restored to Performance ≥ 0.95 (undoing the temporary
  relaxation in `3a3b842`), Accessibility ≥ 0.95, median of 3 runs.
- `.env.example` documents all 9 variables; `next.config.ts` wrapped for
  Sentry.

---

## Phase 5 — Launch

**Status:** In progress. Every remaining deliverable is external or manual —
there is no code left to write for this phase.

- [ ] Sitemap submitted to Google Search Console
- [ ] LinkedIn / X announcement published
- [ ] Resume updated with the portfolio link
- [ ] Production monitoring confirmed (Sentry receiving events, Vercel
      Analytics reporting RUM)

### Phase 1 follow-ups now resolved
- `public/resume.pdf` exists — the About page's download link is no longer
  dead.
- `/projects`, `/blog`, and `/contact` are no longer placeholders; only
  `/now` remains a manually-maintained static page, which is by design.
