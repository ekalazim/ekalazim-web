// "use client" required — uses usePathname to highlight the active route.
"use client";

import { navigation } from "@/config/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinksProps {
  className?: string;
  /** Class applied to each individual link. */
  linkClassName?: string;
  /** Called after a link is clicked — used to close the mobile menu. */
  onNavigate?: () => void;
}

/** Renders the primary nav links, highlighting the active route in coral. */
export function NavLinks({ className, linkClassName, onNavigate }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <ul className={cn("flex items-center gap-6", className)}>
      {navigation.map(({ label, href }) => {
        const isActive = pathname === href || pathname.startsWith(`${href}/`);

        return (
          <li key={href}>
            <Link
              href={href}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "text-sm font-medium transition-colors duration-150 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base",
                isActive ? "text-brand" : "text-text-secondary",
                linkClassName,
              )}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
