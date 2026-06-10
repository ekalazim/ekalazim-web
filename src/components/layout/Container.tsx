import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  /** Use the wide layout (1440px) for galleries / project grids. */
  wide?: boolean;
  className?: string;
}

/**
 * Centers content within the page max-width and applies horizontal padding.
 * Use `wide` for project/gallery grids per `.claude/patterns/styling.md`.
 */
export function Container({ children, wide = false, className }: ContainerProps) {
  return (
    <div className={cn("mx-auto px-4 sm:px-6 lg:px-8", wide ? "max-w-wide" : "max-w-page", className)}>
      {children}
    </div>
  );
}
