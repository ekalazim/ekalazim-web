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
});

export const env = envSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});
