"use client";
// "use client" — reads/writes the URL via useSearchParams + useRouter.

import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface TechTagFilterProps {
  tags: readonly string[];
  /** Currently active tag, or `null` when showing all projects. */
  activeTag: string | null;
}

/**
 * Tech-tag filter for the projects grid. State lives in the URL (`?tag=`) so it
 * survives refresh and is shareable — never local component state (see
 * `.claude/patterns/routing.md` §"URL-Synced State").
 */
export function TechTagFilter({ tags, activeTag }: TechTagFilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  function selectTag(tag: string | null) {
    const params = new URLSearchParams(searchParams);
    if (tag === null || tag === activeTag) {
      params.delete("tag");
    } else {
      params.set("tag", tag);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  const baseClasses =
    "rounded-full border px-3 py-1 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base";

  return (
    <fieldset className="m-0 flex flex-wrap gap-2 border-0 p-0">
      <legend className="sr-only">Filter projects by technology</legend>
      <button
        type="button"
        onClick={() => selectTag(null)}
        aria-pressed={activeTag === null}
        className={cn(
          baseClasses,
          activeTag === null
            ? "border-brand bg-brand text-brand-foreground"
            : "border-border bg-bg-elevated text-text-secondary hover:border-border-strong",
        )}
      >
        All
      </button>
      {tags.map((tag) => {
        const isActive = tag === activeTag;
        return (
          <button
            key={tag}
            type="button"
            onClick={() => selectTag(tag)}
            aria-pressed={isActive}
            className={cn(
              baseClasses,
              isActive
                ? "border-brand bg-brand text-white"
                : "border-border bg-bg-elevated text-text-secondary hover:border-strong",
            )}
          >
            {tag}
          </button>
        );
      })}
    </fieldset>
  );
}
