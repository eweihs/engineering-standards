# Engineering Standards

My personal, opinionated conventions and tooling for my TypeScript projects. It is public so my projects can install it without credentials; it is not open to contributions.

## Contents

| Path | Applies to |
|---|---|
| `guidelines/general.md` | All projects |
| `guidelines/files.md` | All projects |
| `guidelines/git.md` | All projects |
| `guidelines/testing.md` | All projects |
| `guidelines/agents.md` | All projects |
| `guidelines/pull-requests.md` | All projects |
| `guidelines/releases.md` | All projects |
| `guidelines/components.md` | Frontends |
| `guidelines/hooks.md` | Frontends |
| `guidelines/styling.md` | Frontends |
| `guidelines/nestjs.md` | NestJS backends |
| `eslint/` | `base`, `next` and `nest` presets, including test quality rules |
| `knip/` | `next` and `nest` presets |
| `prettier.js` | All projects |
| `tsconfig/base.json` | All projects |
| `.github/workflows/check.yml` | Reusable CI workflow for all projects |
| `.github/workflows/review.yml` | Reusable agent review workflow for all projects |
| `claude/check-on-stop.js` | Claude Code hook for all projects |
| `claude/review.md` | Review instructions for agents, locally and in CI |

Project-specific facts stay in the project: its purpose, routes, deployment, brand tokens and components.

## Install

Install from a tag, so each project chooses when to update:

```bash
npm install --save-dev github:eweihs/engineering-standards#v1.0.0 eslint@9 knip prettier typescript
```

ESLint stays on 9 because `eslint-config-next` depends on plugins that do not support 10 yet.

## Configure

`eslint.config.mjs` in a Next.js project:

```js
import next from "@eweihs/engineering-standards/eslint/next";

export default next;
```

`eslint.config.mjs` in a NestJS project:

```js
import nest from "@eweihs/engineering-standards/eslint/nest";

export default nest;
```

Both presets also lint the tests, with the rules in `eslint/tests.js`:

| Preset | Runner | Files |
|---|---|---|
| `next` | Vitest | `*.test.ts` and `*.test.tsx` outside `tests/` |
| `next` | Playwright | Everything under `tests/` |
| `nest` | Jest | `*.test.ts`, `*.spec.ts` and everything under `test/` or `tests/` |

`@vitest/eslint-plugin` is pinned to the last version that supports TypeScript 5.

`prettier.config.mjs`:

```js
export { default } from "@eweihs/engineering-standards/prettier";
```

`knip.config.js` in a Next.js project (use `knip/nest` in a NestJS project):

```js
export { default } from "@eweihs/engineering-standards/knip/next";
```

Use `.js`, not `.ts`: the presets have no type declarations, so a `.ts` config fails `tsc`. knip does not look for `knip.config.mjs`.

Project-specific settings go on top of the preset:

```js
import next from "@eweihs/engineering-standards/knip/next";

export default {
  ...next,
  ignoreDependencies: ["shadcn"],
};
```

`package.json` scripts:

```json
"typecheck": "tsc --noEmit",
"lint": "eslint .",
"lint:unused": "knip",
"format:check": "prettier --check .",
"check": "npm run typecheck && npm run lint && npm run lint:unused && npm run format:check && npm run test:unit && npm run test:integration"
```

`check` is the one command that must pass before a change is done. CI and the Claude Code hook below both run it.

`tsconfig.json`:

```json
{ "extends": "@eweihs/engineering-standards/tsconfig/base.json" }
```

## CI

`.github/workflows/check.yml` in the project:

```yaml
name: Check

on:
  pull_request:
    types: [opened, synchronize, reopened, ready_for_review]

jobs:
  check:
    uses: eweihs/engineering-standards/.github/workflows/check.yml@v3.0.0
    with:
      playwright: true
```

Use the same tag as the installed package. The workflow installs dependencies and runs `npm run check`.

To keep the use of GitHub's runners low, the workflow:

- Runs on pull requests only. A merge to `main` does not run it again, because the pull request was already green.
- Skips draft pull requests. `ready_for_review` starts the run when a draft is marked ready.
- Cancels the run in progress when a new commit is pushed to the same pull request.
- Stops after `timeout-minutes`.

Do not add a `paths` or `paths-ignore` filter. A filtered-out workflow never reports its status, so a required check would block the pull request forever.

| Input | Default | Purpose |
|---|---|---|
| `node-version` | `24` | Node.js version |
| `command` | `npm run check` | The command that must pass |
| `playwright` | `false` | Install Chromium first, for browser tests |
| `timeout-minutes` | `10` | Fail a run that takes longer |

A reusable workflow cannot start service containers for its caller. A project whose integration tests need a database writes its own job with that service and runs `npm run check` in it.

Make the `check` job a required status check in the repository's branch protection, so a red pull request cannot merge.

### Agent review

`.github/workflows/review.yml` in the project:

```yaml
name: Review

on:
  pull_request:
    types: [labeled]

jobs:
  review:
    permissions:
      contents: read
      pull-requests: write
      id-token: write
    uses: eweihs/engineering-standards/.github/workflows/review.yml@v3.1.0
    secrets:
      CLAUDE_CODE_OAUTH_TOKEN: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}
```

An agent reviews the pull request against `claude/review.md` and comments on it: one inline comment per finding and one summary. It can read the code and comment, nothing else. The workflow saves the pull request's title and description to `.pull-request.md` and its diff to `.pull-request.diff` in the checkout, so the reviewer reads them as files.

Before the first run:

1. Install the [Claude GitHub app](https://github.com/apps/claude) on the repository.
2. Run `claude setup-token` and save the token as the repository secret `CLAUDE_CODE_OAUTH_TOKEN`. Reviews then count toward the Claude subscription. To pay per use instead, pass an `ANTHROPIC_API_KEY` secret.

The review never starts on its own. Add the `review` label to a pull request to start one; create the label in the repository first. For another pass after new commits, remove the label and add it again.

| Input | Default | Purpose |
|---|---|---|
| `label` | `review` | The label that starts a review |
| `instructions` | `node_modules/@eweihs/engineering-standards/claude/review.md` | The review instructions to follow |
| `node-version` | `24` | Node.js version |
| `max-turns` | `40` | Stop the agent after this many steps |
| `timeout-minutes` | `10` | Fail a run that takes longer |

Do not make this job a required status check. It reports findings as comments; `check` is the gate.

## Claude Code

Block the agent from finishing while `check` fails, in the project's `.claude/settings.json`:

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node \"$CLAUDE_PROJECT_DIR/node_modules/@eweihs/engineering-standards/claude/check-on-stop.js\"",
            "timeout": 900
          }
        ]
      }
    ]
  }
}
```

When the agent tries to finish, the hook runs `npm run check` and hands any failure back to it. It skips the run when no file changed since the last passing check, and lets the agent stop after three failed attempts in a row, with a warning. To run a different command, add it after the path.

Add the review as a skill, in the project's `.claude/skills/review-branch/SKILL.md`:

```md
---
name: review-branch
description: Review the current branch against the engineering standards. Use before opening a pull request.
context: fork
background: false
---

Review the changes on the current branch against its base branch.

Follow `node_modules/@eweihs/engineering-standards/claude/review.md`. Give the findings and the summary in your reply. Do not post comments and do not edit files.
```

`/review-branch` then runs the same review as CI, in a fresh agent that has not seen how the code was written.

Point the project's `CLAUDE.md` at the guidelines that apply:

```md
Before making changes, read:

1. `.claude/guidelines/project.md`
2. `node_modules/@eweihs/engineering-standards/guidelines/general.md`
3. `node_modules/@eweihs/engineering-standards/guidelines/files.md`
4. `node_modules/@eweihs/engineering-standards/guidelines/agents.md`
5. `node_modules/@eweihs/engineering-standards/guidelines/pull-requests.md`
```

## Changing the standards

Change this repo, release a new version, then bump the tag in each project. A new lint rule reaches a project only when that project updates.

### Releasing

The version in `package.json` matches the latest tag, because each project's lockfile shows it. Release from an up-to-date `main`, after the pull request is merged:

```bash
npm version minor -m "chore(release): %s"
git push --follow-tags
gh release create "v$(node -p "require('./package.json').version")" --verify-tag --generate-notes
```

`npm version` updates `package.json` and `package-lock.json`, commits them and creates the tag. `gh release create` publishes the GitHub release for that tag, with the pull requests merged since the previous tag as its notes. Edit them into Features and Fixes, and mark anything a project must act on, so a project can read what changed before it bumps the tag. Pick the part to raise from the changes since the last tag:

- `patch`: a fix that projects pick up without changes
- `minor`: something new, such as a guideline, a workflow input or a lint rule that warns
- `major`: anything a project must act on, such as a lint rule that errors or a renamed workflow input

Then bump the tag in each project's `package.json`, `check.yml` and `review.yml`.

Project examples must stay neutral. If a rule only makes sense for one project, it belongs in that project.
