import { ContactForm } from "@/components/shared/ContactForm";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: "Get in touch with Haikal Azim Abu Bakar.",
  path: "/contact",
});

/** Contact page: React Hook Form + Zod validation, submitted via a Server
 * Action that rate-limits, screens honeypots, and emails via Resend. */
export default function ContactPage() {
  return (
    <div className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-text-primary">Contact</h1>
      <p className="mt-4 text-lg text-text-secondary">
        Have a project in mind or just want to say hello? Send a message below, or reach me directly at{" "}
        <a href={`mailto:${siteConfig.email}`} className="text-brand underline-offset-2 hover:underline">
          {siteConfig.email}
        </a>
        .
      </p>
      <div className="mt-10 max-w-xl">
        <ContactForm />
      </div>
    </div>
  );
}
