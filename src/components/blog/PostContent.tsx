import rehypePrettyCode, { type Options as PrettyCodeOptions } from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

interface PostContentProps {
  /** Article body as markdown (from Notion via `notion-to-md`). */
  content: string;
}

/**
 * Renders a blog article's markdown to HTML on the server (zero client JS).
 * GitHub-flavoured markdown via `remark-gfm`; code blocks highlighted at
 * build/revalidate time by Shiki through `rehype-pretty-code` with a dual
 * light/dark theme (`--shiki-light`/`--shiki-dark`), themed via `prose.css`.
 *
 * This is an async Server Component because Shiki highlighting is async —
 * `react-markdown` processes synchronously and cannot host it.
 */
const prettyCodeOptions: PrettyCodeOptions = {
  theme: { light: "github-light", dark: "github-dark" },
  // We paint the code-block background from our own tokens in `prose.css`.
  keepBackground: false,
};

export async function PostContent({ content }: PostContentProps) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypePrettyCode, prettyCodeOptions)
    .use(rehypeStringify)
    .process(content);

  return (
    // Content is authored solely by the site owner in Notion (trusted source).
    // biome-ignore lint/security/noDangerouslySetInnerHtml: server-rendered markdown from a trusted, owner-only CMS.
    <div className="prose mt-12" dangerouslySetInnerHTML={{ __html: String(file) }} />
  );
}
