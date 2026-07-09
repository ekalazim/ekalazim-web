import { calculateReadingTime } from "@/lib/reading-time";
import { describe, expect, it } from "vitest";

describe("calculateReadingTime", () => {
  it("rounds up to whole minutes at 200 wpm", () => {
    // 250 words → 1.25 min → 2 minutes.
    const content = Array.from({ length: 250 }, () => "word").join(" ");
    expect(calculateReadingTime(content)).toBe(2);
  });

  it("returns at least 1 minute for short or empty content", () => {
    expect(calculateReadingTime("")).toBe(1);
    expect(calculateReadingTime("just a few words")).toBe(1);
  });

  it("ignores surrounding and repeated whitespace", () => {
    const content = `  ${Array.from({ length: 400 }, () => "w").join("\n\n  ")}  `;
    expect(calculateReadingTime(content)).toBe(2);
  });
});
