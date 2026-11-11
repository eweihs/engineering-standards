#!/usr/bin/env node
// Claude Code Stop hook. Blocks the agent from finishing while the project's
// check fails, and feeds the failure back to it.
//
// Usage in .claude/settings.json: node <this file> [command]
// The command defaults to `npm run check`.
import { execFileSync, spawnSync } from "node:child_process";
import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";

// After this many failed attempts in a row the agent may stop, so a check it
// cannot fix does not loop forever.
const MAX_ATTEMPTS = 3;
const OUTPUT_LINES = 80;

const command = process.argv.slice(2).join(" ") || "npm run check";

const readInput = () => {
  try {
    return JSON.parse(readFileSync(0, "utf8"));
  } catch {
    // No input, such as a manual run: treat it as a fresh stop.
    return {};
  }
};

const git = (args, env = {}) =>
  execFileSync("git", args, {
    encoding: "utf8",
    env: { ...process.env, ...env },
    stdio: ["ignore", "pipe", "ignore"],
  }).trim();

const gitPath = (name) => {
  try {
    return git(["rev-parse", "--git-path", name]);
  } catch {
    // Not a git repository: run the check every time.
    return null;
  }
};

// One hash for everything in the working tree that git does not ignore,
// taken through a scratch index so the real index stays untouched.
const hashWorkingTree = () => {
  const index = gitPath("index");
  const scratch = gitPath("engineering-standards-check.index");
  if (!index || !scratch) return null;

  try {
    if (existsSync(index)) copyFileSync(index, scratch);
    git(["add", "--all"], { GIT_INDEX_FILE: scratch });
    return git(["write-tree"], { GIT_INDEX_FILE: scratch });
  } catch {
    return null;
  }
};

const readState = (file) => {
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch {
    // No state yet, or an unreadable file: start over.
    return {};
  }
};

const input = readInput();
process.chdir(process.env.CLAUDE_PROJECT_DIR ?? input.cwd ?? process.cwd());

const stateFile = gitPath("engineering-standards-check.json");
const state = stateFile ? readState(stateFile) : {};
const saveState = (next) => {
  if (stateFile) writeFileSync(stateFile, JSON.stringify(next));
};

const tree = hashWorkingTree();

// Nothing changed since the last passing check.
if (tree && state.passed === tree) process.exit(0);

// `stop_hook_active` is true when the agent is continuing because this hook
// blocked it; otherwise this is a new stop and the count starts again.
const attempts = input.stop_hook_active ? (state.attempts ?? 0) : 0;

if (attempts >= MAX_ATTEMPTS) {
  saveState({ ...state, attempts: 0 });
  const message = `\`${command}\` still fails after ${MAX_ATTEMPTS} attempts. The agent stopped with a failing check.`;
  process.stdout.write(JSON.stringify({ systemMessage: message }));
  process.exit(0);
}

const result = spawnSync(command, { shell: true, encoding: "utf8" });

if (result.status === 0) {
  saveState({ passed: tree, attempts: 0 });
  process.exit(0);
}

saveState({ ...state, attempts: attempts + 1 });

const output = `${result.stdout ?? ""}${result.stderr ?? ""}`.trimEnd().split("\n");
console.error(
  [
    `\`${command}\` failed. Fix the cause, then finish. Do not weaken or skip a check to make it pass.`,
    "",
    ...output.slice(-OUTPUT_LINES),
  ].join("\n"),
);
process.exit(2);
