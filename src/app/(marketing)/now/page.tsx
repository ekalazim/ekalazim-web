import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = buildMetadata({
  title: "Now",
  description: "What Haikal Azim is currently working on, focusing on, and learning.",
  path: "/now",
});

/**
 * "What I'm working on right now" page. SSG — updated by editing this file
 * and redeploying (PRD §5.6).
 */
export default function NowPage() {
  return (
    <div className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-text-primary">Now</h1>
      <p className="mt-2 text-sm text-text-muted">Last updated: June 2026</p>

      <section className="mt-8 space-y-4 text-lg text-text-secondary">
        <p>
          Right now I'm building ekalazim.com — this site — as a working demonstration of senior-level
          frontend engineering: Next.js 15, a hand-tuned design system, and a performance budget I'm holding
          myself to.
        </p>
        <p>
          Next up: wiring the Notion-powered blog and writing the first technical posts on the architecture
          decisions behind this site.
        </p>
      </section>
    </div>
  );
}
