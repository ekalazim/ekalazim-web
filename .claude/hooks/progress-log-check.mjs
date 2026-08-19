#!/usr/bin/env node
/**
 * PreToolUse hook — progress-log guard.
 *
 * CLAUDE.md §"Progress Log — Definition of Done" requires that a commit which
 * completes or names a phase also updates `progress.md`. The log silently went
 * three phases stale once; this hook is the safety net that catches it before
 * the commit lands rather than after.
 *
 * Fires only on git-commit commands whose message mentions a phase. Emits an
 * "ask" permission decision (a prompt you can approve) — never a hard block,
 * since plenty of commits legitimately mention a phase in passing.
 *
 * Exits silently (code 0, no output) in every other case, including on its own
 * internal errors: a broken guard must never wedge the commit flow.
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const REASON =
  "This commit names a phase, but progress.md is neither staged nor modified. " +
  "CLAUDE.md requires the phase entry in progress.md and the Current Phase bump " +
  "to land in the same commit. Update the log first, or approve to commit anyway.";

function readStdin() {
  try {
    return readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

function gitFiles(args) {
  try {
    return execFileSync("git", args, { encoding: "utf8" }).split("\n");
  } catch {
    return [];
  }
}

function main() {
  const raw = readStdin();
  if (!raw.trim()) return;

  let command = "";
  try {
    command = JSON.parse(raw)?.tool_input?.command ?? "";
  } catch {
    return;
  }
  if (typeof command !== "string" || !command.includes("git commit")) return;

  // Only guard commits that actually claim phase work.
  if (!/phases?[\s-]?\d/i.test(command)) return;

  // Staged OR working-tree modified — `git commit -a` stages nothing up front.
  const touched = [...gitFiles(["diff", "--cached", "--name-only"]), ...gitFiles(["diff", "--name-only"])];
  if (touched.some((f) => f.trim() === "progress.md")) return;

  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "ask",
        permissionDecisionReason: REASON,
      },
    }),
  );
}

try {
  main();
} catch {
  // Never let a guard failure block a commit.
}
