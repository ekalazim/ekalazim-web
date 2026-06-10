import { cn } from "@/lib/utils";
import { describe, expect, it } from "vitest";

describe("cn", () => {
  it("merges class names and resolves conflicting Tailwind utilities", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("drops falsy values", () => {
    expect(cn("base", false && "hidden", undefined, "visible")).toBe("base visible");
  });

  it("allows a trailing className override to win", () => {
    expect(cn("text-text-primary", "text-brand")).toBe("text-brand");
  });
});
