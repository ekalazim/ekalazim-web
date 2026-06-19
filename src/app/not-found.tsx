import { Button } from "@/components/ui/button";
import Link from "next/link";

/** Rendered when `notFound()` is called or a route doesn't match. */
export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="font-mono text-sm font-medium text-brand">404</p>
      <h1 className="text-3xl font-bold tracking-tight text-text-primary">Page not found</h1>
      <p className="max-w-md text-text-secondary">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Button asChild>
        <Link href="/">Back to homepage</Link>
      </Button>
    </div>
  );
}
