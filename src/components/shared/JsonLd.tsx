import type { JsonLd as JsonLdData } from "@/lib/seo";

interface JsonLdProps {
  data: JsonLdData;
}

/**
 * Renders a JSON-LD structured-data `<script>`. The payload is our own typed
 * object (never user input), so serialising it here is safe.
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires raw script content; data is a trusted, app-controlled object.
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
