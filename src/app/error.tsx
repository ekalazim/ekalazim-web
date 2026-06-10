// "use client" required — error boundaries must be Client Components
// (Next.js requirement for app/error.tsx).
"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/** Rendered when a Server or Client Component throws within this segment. */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Replace with Sentry capture once error tracking is wired up (Phase 4).
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="font-mono text-sm font-medium text-error">Error</p>
      <h1 className="text-3xl font-bold tracking-tight text-text-primary">Something went wrong</h1>
      <p className="max-w-md text-text-secondary">An unexpected error occurred while rendering this page.</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
