# CLAUDE.md — ekalazim.com

This file is the primary instruction set for Claude Code working on this project.
Read this file fully before taking any action. When in doubt, re-read it.

---

## Project Identity

**Project:** ekalazim.com — Personal portfolio and technical blog
**Owner:** Haikal Azim Abu Bakar
**Domain:** ekalazim.com
**PRD:** See `/PRD.md` for full product specification
**Status:** Active development

This portfolio is itself a technical demo. Every architectural decision, pattern,
and implementation choice should reflect senior-level frontend engineering.
The code is public. It will be reviewed by engineering hiring panels.
Quality, consistency, and intentionality matter at every level.

---

## Non-Negotiables

These rules are absolute. Never violate them regardless of convenience.

1. **TypeScript strict mode always.** No `any`, no `@ts-ignore`, no type assertions
   without a comment explaining why. Use `noUncheckedIndexedAccess`.

2. **Design tokens always.** Never hardcode hex colors, spacing values, or
   font sizes inline. Always reference CSS variables or Tailwind tokens from
   the design system. See `.claude/patterns/styling.md`.
   **Brand:** Light mode is the default and primary brand expression — warm,
   playful, professional, popping. Dark mode is a matched-mood warm counterpart,
   not an inversion. Three-accent system: coral-orange (primary), teal
   (secondary), violet (tertiary, sparse). Use accents with restraint.

3. **Server Components by default.** Only add `"use client"` when you need
   hooks, event handlers, or browser APIs. Every new component starts as a
   Server Component unless there's a clear reason not to.

4. **Accessibility is not optional.** Every interactive element must be
   keyboard accessible with visible focus states. Every image needs `alt`.
   Every form input needs a label. Run axe mentally before considering a
   component done.

5. **No inline styles.** Everything goes through Tailwind classes or
   CSS variables in `globals.css`.

6. **Performance budget.** Never import a library without checking its bundle
   size. Use dynamic imports for heavy dependencies (Framer Motion, etc.).
   Check `.claude/patterns/styling.md` for the performance rules.

7. **Biome for all formatting and linting.** Never suggest ESLint or Prettier.
   Run `pnpm lint` and `pnpm format` before considering any task done.

---

## Tech Stack (Locked — Do Not Change Without Asking)

- **Framework:** Next.js 15 App Router
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v4 + CSS variables
- **UI Primitives:** shadcn/ui
- **Forms:** React Hook Form + Zod
- **Blog CMS:** Notion API + `notion-to-md`
- **Email:** Resend
- **Rate limiting:** Upstash Redis
- **Analytics:** Vercel Analytics
- **Error tracking:** Sentry
- **Animation:** Framer Motion (lazy loaded) + native CSS
- **Package manager:** pnpm (always — never npm or yarn)
- **Linting/formatting:** Biome
- **Testing:** Vitest (unit) + Playwright (E2E)

---

## Patterns Reference

Before implementing any feature, read the relevant pattern file:

| What you're building | Read this first |
|---|---|
| Any component | `.claude/patterns/components.md` |
| Any styles or design tokens | `.claude/patterns/styling.md` |
| Any page, layout, or route | `.claude/patterns/routing.md` |
| Any data fetching (Notion, ISR) | `.claude/patterns/data-fetching.md` |
| Any Server Action or form | `.claude/patterns/server-actions.md` |

---

## Rendering Strategy (Critical — Read Before Every New Page)

| Page/Route | Strategy | Why |
|---|---|---|
| `/` | SSG | Stable content, maximum performance |
| `/about` | SSG | Pure static content |
| `/projects` | SSG | Project data lives in repo |
| `/projects/[slug]` | SSG + `generateStaticParams` | One page per project at build |
| `/blog` | ISR (60s) | Reflects Notion publishes within 60s |
| `/blog/[slug]` | ISR (60s) | Article edits reflect within 60s |
| `/contact` | SSG + Server Action | UI static, submission server-side |
| `/now` | SSG | Manually updated on redeploy |

**Rule:** If you're adding a new page and the rendering strategy isn't listed
above, stop and consult the PRD before proceeding.

---

## Folder Conventions

```
src/app/           → Pages, layouts, API routes only. No business logic.
src/components/    → All UI components. Grouped by domain.
src/lib/           → Pure utility functions, API clients. No React.
src/actions/       → Server Actions only.
src/types/         → TypeScript type definitions only.
src/config/        → Static configuration (site metadata, navigation).
src/styles/        → Global CSS and prose typography only.
content/           → Static content (project data, now page MDX).
tests/e2e/         → Playwright tests.
tests/unit/        → Vitest tests.
```

Never put business logic in `app/`. Never put React components in `lib/`.
Never put types in component files — put them in `src/types/`.

---

## Environment Variables

All secrets live in Vercel env vars. Locally in `.env.local` (never committed).

Validated at startup via `src/lib/env.ts` using Zod. If you add a new env var:
1. Add it to `src/lib/env.ts`
2. Add it to `.env.example` with a placeholder value
3. Add it to the Vercel project settings
4. Document it in `PRD.md` Section 9

Never access `process.env` directly outside of `src/lib/env.ts`.

---

## Component Authoring Rules (Summary)

Full rules in `.claude/patterns/components.md`. Key points:

- One component per file
- Named exports only (no default exports except for pages)
- Props interface defined above the component, named `[ComponentName]Props`
- Loading, error, and empty states required for any data-driven component
- Framer Motion imported with `dynamic()` only

---

## Git Conventions

- Branch naming: `feat/[feature-name]`, `fix/[bug-name]`, `chore/[task]`
- Commit format: `feat: add reading progress bar to blog posts`
- Never commit directly to `main`
- PRs require Lighthouse CI to pass (≥ 95 Performance score)

---

## When You're Unsure

1. Re-read the relevant `.claude/patterns/` file
2. Re-read the PRD section for the feature you're building
3. Follow the existing pattern in the codebase before inventing a new one
4. Ask before introducing a new dependency

---

## Current Phase

**Phase 5 — Launch**

Phases 1–4 are complete (Foundation, Projects, Blog, Contact + Quality). Phase 4
shipped the contact form (React Hook Form + Zod → Server Action with honeypot,
Upstash rate limiting, and Resend email), Sentry error tracking, Playwright E2E
coverage for contact, and restored the Lighthouse performance gate to ≥ 95.

Note: the contact/Sentry/rate-limit services degrade gracefully when their env
vars are unset — email logs to the console, rate limiting fails open, and Sentry
no-ops — so builds and E2E stay green without secrets. Real values in Vercel
activate real behavior.

Goals for this phase:
- Public announcement (LinkedIn / X)
- Submit sitemap to Google Search Console
- Confirm production monitoring (Sentry, Vercel Analytics)
- Update resume with portfolio link

When Phase 5 is complete, update this line to: `Phase 6 — Post-Launch (v1.5)`

---

## Progress Log — Definition of Done

`progress.md` is the running record of what shipped, phase by phase. It went
three phases stale once (Phases 2–4 were built but never logged) because
nothing tied the log to the work. This rule closes that gap.

**A phase is not complete until, in the same commit that finishes it:**

1. `progress.md` has a `## Phase N — Name` section describing what was built
   and why — matching the structure of the existing entries (Status line,
   `###` subsections by area, backticked file paths, a Tests subsection).
2. The `## Current Phase` section above is bumped to the next phase, with its
   goals list replaced.
3. Any "Known follow-ups" from earlier phases that this work resolved are
   marked resolved rather than left to rot.

**Also log mid-phase:** any change that alters architecture, adds a dependency,
introduces an env var, or changes a rendering strategy gets a bullet in the
current phase's section — don't wait for the phase boundary.

A `PreToolUse` hook (`.claude/hooks/progress-log-check.mjs`, wired up in
`.claude/settings.json`) intercepts git-commit commands whose message names a
phase and asks for confirmation when `progress.md` is neither staged nor
modified. It prompts rather than blocks — commits mention phases in passing
all the time — and fails silent on any internal error so it can never wedge a
commit. The hook is a safety net, not the rule; this section is the rule.
