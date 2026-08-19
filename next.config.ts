import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Content-Security-Policy is deferred — needs care around the inline
  // JSON-LD <script> on the homepage and next-themes' inline theme script
  // before it can be tightened without breaking them (PRD §6.6).
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

// Wraps the config to instrument the app with Sentry. Source-map upload only
// runs when SENTRY_AUTH_TOKEN is present (CI/Vercel); otherwise it is silently
// skipped, so local/CI builds stay green without Sentry credentials.
export default withSentryConfig(nextConfig, {
  silent: !process.env.CI,
  disableLogger: true,
});
