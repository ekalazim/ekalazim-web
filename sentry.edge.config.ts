import { env } from "@/lib/env";
import * as Sentry from "@sentry/nextjs";

// Edge-runtime Sentry init (middleware, edge routes). No-ops without a DSN.
if (env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 1.0,
  });
}
