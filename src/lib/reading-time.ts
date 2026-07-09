/**
 * Estimated reading time in minutes for a block of content, at an average
 * adult reading speed of 200 words per minute. Always at least 1 minute.
 */
export function calculateReadingTime(content: string): number {
  const WORDS_PER_MINUTE = 200;
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}
