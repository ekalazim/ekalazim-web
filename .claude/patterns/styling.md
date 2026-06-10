# Pattern: Styling

Reference this file before writing any styles or using design tokens.

---

## Golden Rule

**Never use hardcoded hex colors, pixel values for spacing, or raw font sizes.**
Always use CSS variables or Tailwind tokens. This ensures light/dark mode
consistency and makes global changes trivial.

```tsx
// ✅ Correct — uses design token via Tailwind
<div className="bg-elevated text-primary border border-border">

// ❌ Wrong — hardcoded color
<div style={{ backgroundColor: "#FFFBF5", color: "#1A1614" }}>
```

---

## Brand Direction

**Light mode is the default and primary brand expression.**
Warm, playful, professional, popping. Light mode is what recruiters and
hiring panels see first — it's the presentation surface.

Dark mode is a **matched-mood counterpart**, not an inversion. It uses a warm
near-black base (brown undertone, never cold grey) so the brand feels like the
same identity at night. The three accent colors brighten slightly in dark mode
to maintain pop against the darker base.

**Accent system (three colors, not one):**
- Coral-orange — primary. Energy, warmth, the "funky" pop. CTAs, primary actions.
- Teal — secondary. Pairs with coral for the playful-sophisticated feel. Secondary actions, success-adjacent highlights.
- Violet — tertiary. Used sparingly. Tags, hover accents, decorative highlights.

---

## Design Token Definitions

All tokens defined in `src/styles/globals.css` as CSS variables.
Light mode is the `:root` default. Dark mode overrides under `.dark`.

```css
/* src/styles/globals.css */

:root {
  /* === BRAND ACCENTS (light mode) === */
  --brand-primary: #FF5C39;          /* coral-orange — CTAs, primary actions */
  --brand-primary-hover: #E84A28;
  --brand-primary-muted: #FFE3D6;    /* chip/tag background */
  --brand-primary-foreground: #FFFFFF;
  --brand-primary-text: #B83A1C;     /* coral text on muted bg */

  --brand-secondary: #14B88A;        /* teal — secondary accent */
  --brand-secondary-hover: #0FA078;
  --brand-secondary-muted: #E5F3EC;
  --brand-secondary-text: #0F6E56;

  --brand-tertiary: #7C6FF0;         /* violet — sparse highlights */
  --brand-tertiary-hover: #6A5CE8;
  --brand-tertiary-muted: #ECEAFD;
  --brand-tertiary-text: #4A3FB0;

  /* === BACKGROUNDS (light mode) === */
  --bg-base: #FFFBF5;        /* warm off-white — page background */
  --bg-elevated: #FFFFFF;    /* cards, surfaces */
  --bg-subtle: #F7EFE3;      /* inputs, hover backgrounds */

  /* === TEXT (light mode) === */
  --text-primary: #1A1614;   /* warm near-black */
  --text-secondary: #6B5D4F; /* warm grey-brown */
  --text-muted: #9A8B7A;     /* placeholders, hints */

  /* === BORDERS (light mode) === */
  --border: #EFE6D8;         /* warm subtle border */
  --border-strong: #DDD0BC;  /* emphasized border */

  /* === SEMANTIC (light mode) === */
  --success: #14B88A;        /* reuse teal */
  --warning: #F2A93B;
  --error: #E24B4A;
  --info: #378ADD;
}

.dark {
  /* === BRAND ACCENTS (dark mode — brightened for pop) === */
  --brand-primary: #FF6B47;
  --brand-primary-hover: #FF8059;
  --brand-primary-muted: #3A2218;
  --brand-primary-foreground: #2A0E04;
  --brand-primary-text: #FFB59B;

  --brand-secondary: #2DD4A0;
  --brand-secondary-hover: #45E0B0;
  --brand-secondary-muted: #113025;
  --brand-secondary-text: #5DCAA5;

  --brand-tertiary: #9B8FF5;
  --brand-tertiary-hover: #ADA2F8;
  --brand-tertiary-muted: #241F3A;
  --brand-tertiary-text: #C5BDF9;

  /* === BACKGROUNDS (dark mode — warm near-black) === */
  --bg-base: #15110E;        /* warm near-black, brown undertone */
  --bg-elevated: #1E1813;    /* cards, surfaces */
  --bg-subtle: #2A201A;      /* inputs, hover backgrounds */

  /* === TEXT (dark mode) === */
  --text-primary: #FBF3E8;   /* warm off-white */
  --text-secondary: #B5A48F; /* warm muted */
  --text-muted: #7A6E5E;     /* hints, disabled */

  /* === BORDERS (dark mode) === */
  --border: #2F261D;         /* warm dark border */
  --border-strong: #463829;

  /* === SEMANTIC (dark mode) === */
  --success: #2DD4A0;
  --warning: #F2B95B;
  --error: #F0716F;
  --info: #5DA9E8;
}
```

---

## Tailwind Token Mapping

In Tailwind v4, define these in globals.css under @theme so utilities resolve to tokens:

```css
@theme {
  --color-bg-base: var(--bg-base);
  --color-bg-elevated: var(--bg-elevated);
  --color-bg-subtle: var(--bg-subtle);

  --color-text-primary: var(--text-primary);
  --color-text-secondary: var(--text-secondary);
  --color-text-muted: var(--text-muted);

  --color-brand: var(--brand-primary);
  --color-brand-hover: var(--brand-primary-hover);
  --color-brand-muted: var(--brand-primary-muted);
  --color-brand-text: var(--brand-primary-text);

  --color-secondary-accent: var(--brand-secondary);
  --color-secondary-muted: var(--brand-secondary-muted);
  --color-secondary-text: var(--brand-secondary-text);

  --color-tertiary-accent: var(--brand-tertiary);
  --color-tertiary-muted: var(--brand-tertiary-muted);
  --color-tertiary-text: var(--brand-tertiary-text);

  --color-border: var(--border);
  --color-border-strong: var(--border-strong);

  --color-success: var(--success);
  --color-warning: var(--warning);
  --color-error: var(--error);
  --color-info: var(--info);
}
```

This generates utilities like `bg-bg-base`, `text-brand`, `bg-brand-muted`,
`text-secondary-accent`, etc.

---

## Color Token Usage Reference

```
Backgrounds
  bg-bg-base         → page background (warm off-white / warm near-black)
  bg-bg-elevated     → cards, surfaces, modals
  bg-bg-subtle       → inputs, hover backgrounds

Text
  text-text-primary    → primary body text
  text-text-secondary  → labels, metadata, captions
  text-text-muted      → placeholders, disabled text

Primary accent (coral-orange)
  bg-brand             → primary CTA background
  text-brand           → coral accent text (use on base/elevated bg)
  bg-brand-muted       → coral chip/tag background
  text-brand-text      → coral text ON brand-muted background

Secondary accent (teal)
  bg-secondary-accent  → teal background
  text-secondary-accent→ teal accent text
  bg-secondary-muted   → teal chip background
  text-secondary-text  → teal text ON secondary-muted background

Tertiary accent (violet — use sparingly)
  bg-tertiary-accent   → violet background
  text-tertiary-accent → violet accent text
  bg-tertiary-muted    → violet chip background
  text-tertiary-text   → violet text ON tertiary-muted background

Borders
  border-border        → default border
  border-border-strong → emphasized border
```

---

## Accent Usage Discipline

The three-accent system only stays "playful professional" if used with restraint:

- **Coral-orange (primary):** One primary CTA per section. Primary buttons,
  active nav states, key links. This is the loudest color — don't overuse it.
- **Teal (secondary):** Secondary buttons, success states, alternating project
  card accents, tags. Balances the coral.
- **Violet (tertiary):** Sparingly. A tag category, a hover highlight, one
  decorative element per page. If everything is accented, nothing pops.

**Rule of thumb:** On any given screen, coral should appear 1-3 times, teal
2-4 times, violet 0-2 times. The warm neutrals do most of the work.

```tsx
// Primary CTA — coral
<button className="bg-brand text-white hover:bg-brand-hover rounded-sm px-5 py-2.5">
  Get in touch
</button>

// Secondary button — teal outline
<button className="border border-secondary-accent text-secondary-accent hover:bg-secondary-muted rounded-sm px-5 py-2.5">
  View projects
</button>

// Tag chips — mix accents by category
<span className="bg-brand-muted text-brand-text rounded-full px-3 py-1 text-sm">Next.js</span>
<span className="bg-secondary-muted text-secondary-text rounded-full px-3 py-1 text-sm">TypeScript</span>
<span className="bg-tertiary-muted text-tertiary-text rounded-full px-3 py-1 text-sm">NestJS</span>
```

---

## Typography Scale

Use these Tailwind classes. Never use arbitrary values like `text-[17px]`.

```
text-display   → hero headlines (4.5rem)
text-4xl       → h1 equivalents (3rem)
text-3xl       → h2 equivalents (2.25rem)
text-2xl       → h3 equivalents (1.5rem)
text-xl        → h4 equivalents (1.25rem)
text-lg        → large body text (1.125rem) — preferred for reading content
text-base      → default UI text (1rem)
text-sm        → captions, metadata (0.875rem)
```

Font families (via CSS variables, wired in Tailwind):
```
font-sans   → Geist Sans (all UI text)
font-mono   → Geist Mono (code blocks, technical labels)
```

---

## Spacing Conventions

Use the Tailwind default scale. Prefer multiples of 4:

```
p-1  →  4px    gap-1  →  4px
p-2  →  8px    gap-2  →  8px
p-3  →  12px   gap-3  →  12px
p-4  →  16px   gap-4  →  16px
p-6  →  24px   gap-6  →  24px
p-8  →  32px   gap-8  →  32px
p-12 →  48px
p-16 →  64px
p-24 →  96px
```

Never use arbitrary values like `p-[22px]` unless there's a documented reason.

---

## Border Radius Conventions

Slightly rounder than typical to support the playful feel:

```
rounded-sm    → 8px   — buttons, small UI elements
rounded-md    → 12px  — cards, inputs, dropdowns
rounded-lg    → 18px  — large cards, modals
rounded-full  → 9999px — pills, tags, avatars (used often for the funky feel)
```

---

## Container / Layout Widths

```tsx
// Page content container
<div className="max-w-page mx-auto px-4 sm:px-6 lg:px-8">

// Blog / article reading container
<div className="max-w-content mx-auto">

// Wide layout (projects grid, gallery)
<div className="max-w-wide mx-auto px-4 sm:px-6">
```

Defined in Tailwind config:
- `max-w-content` = 720px
- `max-w-page` = 1200px
- `max-w-wide` = 1440px

---

## Light / Dark Mode

**Light mode is the default** (`:root`). Dark mode is opt-in via `next-themes`
adding a `.dark` class to `<html>`.

All color tokens automatically swap. **Never hardcode dark/light variants manually:**

```tsx
// ✅ Correct — tokens handle both modes
<div className="bg-bg-elevated text-text-primary">

// ❌ Wrong — manual dark mode override
<div className="bg-white dark:bg-zinc-900 text-black dark:text-white">
```

The only valid use of the `dark:` prefix is for third-party component overrides
where you can't control the token mapping.

**next-themes configuration:** Because light is the brand default, set
`defaultTheme="light"` with `enableSystem` so the brand shows correctly while
still respecting user system preference when they have one set. Use
`attribute="class"` so the `.dark` class drives the token swap.

---

## The `cn` Utility

Always use `cn()` from `@/lib/utils` for conditional class merging:

```tsx
import { cn } from "@/lib/utils"

<div className={cn(
  "base-class rounded-lg p-4",
  featured && "border-brand",
  className  // always last — allows override from parent
)}>
```

Never use template literals for class names.

---

## Animation Performance Rules

Only animate these CSS properties (GPU-accelerated, no layout cost):
- `transform` (translate, scale, rotate)
- `opacity`
- `filter` (blur, brightness)

Never animate:
- `width`, `height`, `padding`, `margin` (layout reflow)
- `background-color` directly (use `transition-colors` Tailwind utility)
- `top`, `left`, `right`, `bottom` (use `translate` instead)

---

## Prose (Blog Article) Typography

Blog content rendered from Notion gets the `prose` class from `src/styles/prose.css`.
Custom prose style, NOT `@tailwindcss/typography`.

```tsx
<article className="prose">
  {/* Rendered Notion content */}
</article>
```

The prose styles define:
- Line height 1.6 for body, 1.1 for headings
- `font-mono` for code blocks with `bg-bg-subtle` background
- Coral brand color for `a` tags (hover to brand-hover)
- Proper heading hierarchy spacing
- `max-w-content` enforced on the article container

Do not modify `prose.css` for one-off overrides — add a utility class instead.

---

## What to Avoid

```
❌ style={{ color: "#FF5C39" }}       → use text-brand
❌ className="text-[#1A1614]"         → use text-text-primary
❌ className="p-[22px]"               → use p-5 or p-6
❌ dark:bg-zinc-900                   → use bg-bg-elevated (token handles it)
❌ className="w-[1200px]"             → use max-w-page
❌ fontFamily: "Geist Sans"           → use font-sans
❌ coral on every element             → restraint: 1-3 coral uses per screen
```
