import { Container } from "@/components/layout/Container";
import { MobileNav } from "@/components/layout/MobileNav";
import { NavLinks } from "@/components/layout/NavLinks";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { siteConfig } from "@/config/site";
import Link from "next/link";

/** Persistent top navigation: wordmark, primary nav, and theme toggle. */
export function Header() {
  return (
    <header className="relative border-b border-border bg-bg-base">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="font-mono text-lg font-semibold tracking-tight text-text-primary transition-colors duration-150 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
          >
            {siteConfig.shortName.toLowerCase().replace(" ", "")}
          </Link>

          <div className="hidden items-center gap-6 sm:flex">
            <NavLinks />
            <ThemeToggle />
          </div>

          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
