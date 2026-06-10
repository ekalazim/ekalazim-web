// "use client" required — uses useState/useEffect and the useTheme hook,
// which reads/writes localStorage and the document class.
"use client";

import { cn } from "@/lib/utils";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const THEME_ORDER = ["light", "dark", "system"] as const;

type Theme = (typeof THEME_ORDER)[number];

const THEME_ICONS: Record<Theme, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

const THEME_LABELS: Record<Theme, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
};

interface ThemeToggleProps {
  className?: string;
}

/**
 * Cycles through Light -> Dark -> System on click. The active choice
 * persists via next-themes (localStorage) and is reflected as the `.dark`
 * class on `<html>`.
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch: theme is unknown on the server.
  useEffect(() => {
    setMounted(true);
  }, []);

  const current: Theme = mounted && THEME_ORDER.includes(theme as Theme) ? (theme as Theme) : "light";
  const Icon = THEME_ICONS[current];

  function handleClick() {
    const currentIndex = THEME_ORDER.indexOf(current);
    const nextTheme = THEME_ORDER[(currentIndex + 1) % THEME_ORDER.length] ?? "light";
    setTheme(nextTheme);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Theme: ${THEME_LABELS[current]}. Click to switch theme.`}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-sm border border-border text-text-secondary transition-colors duration-150 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base",
        className,
      )}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}
