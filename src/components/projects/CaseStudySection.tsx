import type { CaseStudySection as CaseStudySectionData } from "@/types/project";

interface CaseStudySectionProps {
  title: string;
  section: CaseStudySectionData;
}

/** One titled block of a case study — paragraphs plus an optional bullet list. */
export function CaseStudySection({ title, section }: CaseStudySectionProps) {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold tracking-tight text-text-primary">{title}</h2>
      <div className="mt-4 space-y-4 text-lg text-text-secondary">
        {section.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {section.bullets && section.bullets.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {section.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-3 text-text-secondary">
              <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
