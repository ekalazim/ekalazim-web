import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import Link from "next/link";

interface SocialLinksProps {
  className?: string;
}

const links = [
  { label: "GitHub", href: siteConfig.links.github, icon: Github },
  { label: "LinkedIn", href: siteConfig.links.linkedin, icon: Linkedin },
  { label: "X (Twitter)", href: siteConfig.links.twitter, icon: Twitter },
  { label: "Email", href: `mailto:${siteConfig.email}`, icon: Mail },
] as const;

/** Row of social/contact icon links, used in the footer. */
export function SocialLinks({ className }: SocialLinksProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {links.map(({ label, href, icon: Icon }) => (
        <Link
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="inline-flex h-9 w-9 items-center justify-center rounded-sm text-text-secondary transition-colors duration-150 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </Link>
      ))}
    </div>
  );
}
