import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: "Get in touch with Haikal Azim Abu Bakar.",
  path: "/contact",
});

/**
 * Contact page placeholder. The full form (React Hook Form + Zod + Server
 * Action + rate limiting + Resend) ships in Phase 4 per
 * `.claude/patterns/server-actions.md`.
 */
export default function ContactPage() {
  return (
    <div className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-text-primary">Contact</h1>
      <p className="mt-4 text-lg text-text-secondary">
        The contact form is coming soon. In the meantime, reach me directly at{" "}
        <a href={`mailto:${siteConfig.email}`} className="text-brand underline-offset-2 hover:underline">
          {siteConfig.email}
        </a>
        .
      </p>
    </div>
  );
}
