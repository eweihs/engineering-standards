# Pull Request Guidelines

## Size

One pull request does one thing. Aim for fewer than 400 changed lines, not counting lockfiles, snapshots and generated files. Split anything larger.

Mechanical changes, such as a rename, a reformat or a dependency bump, get their own pull request.

## Description

```md
## What and why

<!-- The goal and the reason. Link the ticket when there is one. -->

## Risk

<!-- Low, standard or high, and why. -->

## How it was checked

<!-- What was run or looked at beyond `check`, and what is not verified. -->
```

The description states the intent, so a reviewer can hold the code against it. Say plainly what was not verified.

## Review Layers

Every pull request passes three layers, cheapest first, so a person only looks at what the earlier layers cannot judge.

| Layer | Who | Catches |
|---|---|---|
| 1. Check | CI runs `check` | Everything a tool can decide: types, lint, unused code, format, tests |
| 2. Agent review | An agent that did not write the code | Missed cases, bugs, a poor fit with the codebase, weak tests |
| 3. Human review | A person, as deep as the risk level asks | Architecture, security and anything that needs judgement |

The agent review follows the shared review instructions in `claude/review.md`. It can run in two places:

- Before the pull request is opened, the author runs `/review-branch` and deals with the findings.
- On the pull request, when the findings should be comments: add the `review` label, and the `review.yml` workflow reviews it once.

Answer every blocking finding: fix it, or reply why it is wrong.

React to each agent comment with 👍 or 👎. A finding that keeps being wrong means the review instructions need fixing. A finding that keeps being right means it should become a check.

## Risk Levels

The risk level decides how deep the human review goes.

| Level | Changes | Before merging |
|---|---|---|
| Low | Docs, comments, tests only, copy, minor and patch dependency bumps | A green check and an agent review without blocking findings. A person merges without reading the whole diff. |
| Standard | Features, endpoints, business logic, pages and flows, major dependency upgrades | A person reads the whole diff. |
| High | Authentication and permissions, payments and invoices, personal data, database migrations and data scripts, infrastructure and deployment, CI, hooks, lint and TypeScript config | A person reads the whole diff line by line and tries the change in a non-prod environment. |

- The highest level that matches wins.
- More than 400 changed lines is at least standard.
- The project's `project.md` lists its high-risk paths.
- The author states the level in the description. The agent review checks it against the changed files.

A person always merges. No level lets an agent merge.
