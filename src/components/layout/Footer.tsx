import { Container } from "@/components/layout/Container";
import { SocialLinks } from "@/components/shared/SocialLinks";
import { siteConfig } from "@/config/site";
import Link from "next/link";

/** Site footer: social links, copyright, and the `/now` link. */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-bg-base">
      <Container>
        <div className="flex flex-col items-center gap-4 py-8 sm:flex-row sm:justify-between">
          <p className="text-sm text-text-secondary">
            © {year} {siteConfig.author}. Built with Next.js.
          </p>

          <div className="flex items-center gap-6">
            <Link
              href="/now"
              className="text-sm font-medium text-text-secondary transition-colors duration-150 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
            >
              /now
            </Link>
            <SocialLinks />
          </div>
        </div>
      </Container>
    </footer>
  );
}
