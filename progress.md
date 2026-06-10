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
