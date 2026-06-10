// "use client" required — next-themes reads/writes localStorage and the
// `<html>` class on the client to apply the active theme.
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

type ThemeProviderProps = ComponentProps<typeof NextThemesProvider>;

/**
 * Wraps the app with theme context. Light mode is the brand default
 * (`.claude/patterns/styling.md`), with `enableSystem` so the site still
 * respects a user's system preference when they have one set.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem {...props}>
      {children}
    </NextThemesProvider>
  );
}
