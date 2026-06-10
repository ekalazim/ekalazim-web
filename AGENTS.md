# AGENTS.md — ekalazim.com

Conventions for AI agents (Claude Code, Cursor, etc.) working on this project.
This file supplements CLAUDE.md with multi-agent specific rules.

---

## Agent Roles

When multiple agents are working on this project, they operate in these lanes:

| Agent | Responsibility | Should NOT touch |
|---|---|---|
| **Primary** (Claude Code) | Feature implementation, component building | Infrastructure, Vercel config |
| **Reviewer** (Cursor) | Refactoring, code review, pattern fixes | New feature implementation |
| **Content** | Copy, blog post drafts | Any source code |

---

## Shared Context Rules

Every agent must read before acting:
1. `CLAUDE.md` — project rules and non-negotiables
2. `PRD.md` — product specification and acceptance criteria
3. The relevant `.claude/patterns/` file for the area being changed

---

## What Agents Must Never Do

- Install a new npm package without checking `CLAUDE.md` approved stack
- Create a new page without checking the rendering strategy table in `CLAUDE.md`
- Write inline hex colors or hardcoded spacing values
- Add `"use client"` without a comment explaining which hook or browser API requires it
- Create a default export except on Next.js page files
- Access `process.env` directly — use `src/lib/env.ts`
- Merge to `main` directly — always via PR with passing Lighthouse CI
- Modify `.claude/patterns/` files without explicit instruction from the owner

---

## Code Generation Standards

When generating components, always follow this order:
1. Types/interfaces first (import from `src/types/` or define locally)
2. Server Component by default — add `"use client"` only if required
3. Props interface named `[ComponentName]Props`
4. Component function
5. Any sub-components below in the same file only if they're not reused elsewhere

When generating utility functions in `src/lib/`:
- Pure functions only — no React, no side effects at module level
- Export named functions, not objects
- Every function typed end-to-end

---

## PR / Completion Checklist

Before marking any task complete, verify:

- [ ] TypeScript compiles with zero errors (`pnpm typecheck`)
- [ ] Biome passes with zero errors (`pnpm lint && pnpm format`)
- [ ] No hardcoded colors or spacing values
- [ ] All images use `next/image` with `width` and `height`
- [ ] All interactive elements are keyboard accessible
- [ ] Loading, error, and empty states exist for data-driven components
- [ ] New env vars are added to `src/lib/env.ts` and `.env.example`
- [ ] Rendering strategy matches the table in `CLAUDE.md`
- [ ] No `console.log` statements left in production code

---

## Pattern Precedence

If there's a conflict between patterns, this is the precedence order:
1. `CLAUDE.md` non-negotiables (highest authority)
2. `PRD.md` feature specifications
3. `.claude/patterns/` files
4. Existing code in the codebase
5. Agent's own judgment (lowest — always prefer established patterns)
