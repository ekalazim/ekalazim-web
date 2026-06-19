import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import Link from "next/link";

/** Homepage hero: name, role, positioning statement, and primary CTA. */
export function Hero() {
  return (
    <section className="py-24 sm:py-32">
      <div className="max-w-content">
        <p className="font-mono text-sm font-medium text-brand">{siteConfig.role}</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-text-primary sm:text-display">
          {siteConfig.name}
        </h1>
        <p className="mt-6 text-lg text-text-secondary">{siteConfig.tagline}</p>
        <div className="mt-8">
          <Button asChild size="lg">
            <Link href="/contact">Get in touch</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
