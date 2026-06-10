// "use client" required — uses useState to toggle the mobile menu and
// handles click events.
"use client";

import { NavLinks } from "@/components/layout/NavLinks";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Menu, X } from "lucide-react";
import { useState } from "react";

/** Hamburger menu for small screens, shown in place of the desktop nav. */
export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? "Close menu" : "Open menu"}
        className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-border text-text-primary transition-colors duration-150 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
      >
        {open ? (
          <X className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Menu className="h-4 w-4" aria-hidden="true" />
        )}
      </button>

      {open && (
        <div
          id="mobile-nav-panel"
          className="absolute inset-x-0 top-full z-20 border-b border-border bg-bg-elevated px-4 py-4 shadow-sm"
        >
          <NavLinks
            className="flex-col items-start gap-4"
            linkClassName="text-base"
            onNavigate={() => setOpen(false)}
          />
          <div className="mt-4 border-t border-border pt-4">
            <ThemeToggle />
          </div>
        </div>
      )}
    </div>
  );
}
