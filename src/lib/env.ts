import { z } from "zod";

/**
 * Validated environment variables.
 *
 * This is the ONLY module that should read `process.env` directly. Every
 * other module imports `env` from here so invalid/missing configuration
 * fails fast at build/start time with a clear error.
 *
 * When adding a new env var:
 * 1. Add it to the schema below
 * 2. Add a placeholder to `.env.example`
 * 3. Add the real value to Vercel project settings
 * 4. Document it in `ekalazim-portfolio-prd.md` Section 9
 */
const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default("https://ekalazim.com"),
  // Notion (blog). Optional during phased rollout: when unset, the blog data
  // layer degrades to an empty state so builds/deploys stay green before the
  // integration exists. See `.claude/patterns/data-fetching.md`.
  NOTION_API_KEY: z.string().min(1).optional(),
  NOTION_BLOG_DATABASE_ID: z.string().min(1).optional(),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NOTION_API_KEY: process.env.NOTION_API_KEY,
  NOTION_BLOG_DATABASE_ID: process.env.NOTION_BLOG_DATABASE_ID,
});
