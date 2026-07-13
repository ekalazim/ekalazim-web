// "use client" required — global-error boundaries must be Client Components
// (Next.js requirement). This catches errors in the root layout itself.
"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
}

/** Last-resort boundary for errors thrown in the root layout. Reports to
 * Sentry (no-ops without a DSN) and renders a minimal standalone document. */
export default function GlobalError({ error }: GlobalErrorProps) {
  useEffect(() => {
    Sentry.captureException(error);
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "1rem",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Something went wrong</h1>
        <p>An unexpected error occurred. Please refresh the page.</p>
      </body>
    </html>
  );
}
