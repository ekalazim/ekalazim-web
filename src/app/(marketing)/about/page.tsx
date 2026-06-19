import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description: "The story behind Haikal Azim Abu Bakar — background, current focus, skills, and experience.",
  path: "/about",
});

const skillGroups = [
  {
    category: "Frontend",
    skills: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
  },
  {
    category: "Backend",
    skills: ["Node.js", "PostgreSQL", "Prisma", "REST APIs"],
  },
  {
    category: "Auth & Security",
    skills: ["NextAuth", "JWT", "OWASP basics", "Rate limiting"],
  },
  {
    category: "DevOps",
    skills: ["Vercel", "GitHub Actions", "Docker", "Sentry"],
  },
  {
    category: "Languages",
    skills: ["TypeScript", "JavaScript", "SQL"],
  },
] as const;

const experience = [
  {
    role: "Senior Frontend Engineer",
    org: "Current Company",
    period: "2024 — Present",
  },
  {
    role: "Frontend Engineer",
    org: "Previous Company",
    period: "2021 — 2024",
  },
] as const;

const education = [
  {
    degree: "B.Sc. in Computer Science",
    school: "University Name",
    period: "2017 — 2021",
  },
] as const;

/** About page — bio, current focus, skills, experience, education. SSG. */
export default function AboutPage() {
  return (
    <div className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-text-primary">About</h1>

      <section className="mt-8 space-y-4 text-lg text-text-secondary">
        <p>
          I'm Haikal — a frontend engineer who spends most of my time in the gap between design and
          infrastructure. I care about the details that users feel but never name: the difference between a
          page that loads and a page that feels instant.
        </p>
        <p>
          My background spans production e-commerce, affiliate platforms, and multi-tenant admin tools. Across
          all of it, the throughline has been the same: typed contracts, server-first rendering, and being
          honest about tradeoffs instead of pretending there weren't any.
        </p>
        <p>
          This site is part of that practice — every page here is built the way I'd build it for a client,
          with the same performance budget and the same review standard.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-text-primary">Current focus</h2>
        <p className="mt-4 text-lg text-text-secondary">
          Right now I'm deep in this portfolio — wiring up the Notion-powered blog, refining the design
          system, and writing up the architectural decisions as I make them. See the{" "}
          <Link href="/now" className="text-brand underline-offset-2 hover:underline">
            /now page
          </Link>{" "}
          for what's actively in progress.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-text-primary">Skills</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          {skillGroups.map(({ category, skills }) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-text-primary">{category}</h3>
              <ul className="mt-2 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <li key={skill} className="rounded-full bg-bg-subtle px-3 py-1 text-sm text-text-secondary">
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-text-primary">Experience</h2>
        <ul className="mt-4 space-y-4">
          {experience.map(({ role, org, period }) => (
            <li
              key={`${role}-${org}`}
              className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between"
            >
              <div>
                <p className="font-medium text-text-primary">{role}</p>
                <p className="text-sm text-text-secondary">{org}</p>
              </div>
              <p className="text-sm text-text-muted">{period}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-text-primary">Education</h2>
        <ul className="mt-4 space-y-4">
          {education.map(({ degree, school, period }) => (
            <li key={degree} className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <div>
                <p className="font-medium text-text-primary">{degree}</p>
                <p className="text-sm text-text-secondary">{school}</p>
              </div>
              <p className="text-sm text-text-muted">{period}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <Button asChild variant="secondary">
          <Link href="/resume.pdf" target="_blank" rel="noopener noreferrer">
            Download resume
          </Link>
        </Button>
      </section>
    </div>
  );
}
