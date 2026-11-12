# Agent Guidelines

How coding agents, such as Claude Code, work in a project.

## The Check

Every project has one `check` script that runs every blocking check:

```json
"check": "npm run typecheck && npm run lint && npm run lint:unused && npm run format:check && npm run test:unit && npm run test:integration"
```

The same command runs in three places:

- The agent runs it before it finishes. A Stop hook blocks the agent while it fails.
- CI runs it on every pull request.
- A person runs it before asking for review.

Never weaken a check to make it pass. That means no disabled lint rules, no skipped or deleted tests, no looser types and no `--no-verify`. If a check looks wrong, stop and say so.

## Review Before a Pull Request

Before opening a pull request, the agent runs `/review-branch`. A fresh agent that has not seen how the code was written reviews the branch against the shared review instructions.

The author fixes every blocking finding, or says in the pull request description why it does not hold. The pull request guideline describes the layers after that.

## Where an Instruction Goes

Put each instruction in the narrowest place that works:

| The instruction | Belongs in |
|---|---|
| Must hold every time | A hook, lint rule, type, test or CI step |
| Needed in every session | The root `CLAUDE.md` |
| Only applies to one folder | A `CLAUDE.md` in that folder |
| Only applies to one kind of task | A skill |
| A large, specialised job | A subagent |

Keep the root `CLAUDE.md` short: pointers to the guidelines that apply and to the project's own `project.md`.

When an agent makes the same mistake twice, fix the instruction or add a check. Fixing only the code leaves the mistake to happen again.

## What an Agent May Do

| Level | Meaning | Examples |
|---|---|---|
| Run | The agent acts on its own | Read and edit code, run `check` and tests, commit on a feature branch |
| Approve | The agent asks first | Push, open a pull request, add a dependency, change CI, hooks or lint config, write a database migration |
| Decide | A person does it | Merge to `main`, create a release tag, deploy to prod, delete data, handle secrets, change the scope of the work |

A project's `project.md` may move an action to a stricter level, never to a looser one.

## Giving an Agent Work

A task names:

- The goal, and why it matters
- Acceptance criteria that a test can check
- What is out of scope

Keep tasks small enough for one pull request that a person can review in one sitting.
