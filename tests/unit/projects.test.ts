import {
  getAdjacentProjects,
  getAllProjectSlugs,
  getAllProjects,
  getAllTags,
  getProjectBySlug,
} from "@/lib/projects";
import { describe, expect, it } from "vitest";

describe("getProjectBySlug", () => {
  it("returns the matching project", () => {
    const project = getProjectBySlug("moosanclub");
    expect(project?.title).toBe("MoosanClub");
  });

  it("returns undefined for an unknown slug", () => {
    expect(getProjectBySlug("does-not-exist")).toBeUndefined();
  });
});

describe("getAllProjectSlugs", () => {
  it("returns one slug per project with no duplicates", () => {
    const slugs = getAllProjectSlugs();
    expect(slugs.length).toBe(getAllProjects().length);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("getAllTags", () => {
  it("returns unique, sorted tags", () => {
    const tags = getAllTags();
    expect(new Set(tags).size).toBe(tags.length);
    expect([...tags]).toEqual([...tags].sort((a, b) => a.localeCompare(b)));
  });
});

describe("getAdjacentProjects", () => {
  it("has no prev for the first project", () => {
    const first = getAllProjectSlugs()[0];
    expect(first).toBeDefined();
    const { prev, next } = getAdjacentProjects(first as string);
    expect(prev).toBeUndefined();
    expect(next).toBeDefined();
  });

  it("has no next for the last project", () => {
    const slugs = getAllProjectSlugs();
    const last = slugs[slugs.length - 1];
    expect(last).toBeDefined();
    const { prev, next } = getAdjacentProjects(last as string);
    expect(next).toBeUndefined();
    expect(prev).toBeDefined();
  });

  it("returns empty for an unknown slug", () => {
    expect(getAdjacentProjects("nope")).toEqual({});
  });
});
