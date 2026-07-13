import { env } from "@/lib/env";
import * as Sentry from "@sentry/nextjs";

// Server-runtime Sentry init. No-ops when the DSN is unset (local/CI).
if (env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 1.0,
    enableLogs: true,
  });
}
