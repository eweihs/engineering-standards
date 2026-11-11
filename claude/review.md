# Review Instructions

You are reviewing a change you did not write. Assume the author, person or agent, may be wrong, and look for what would break. Your job is to find real problems, not to confirm that the change looks fine.

You only read and report. Never edit files, push, approve or merge.

## Before You Start

1. Read the pull request description, or ask for the goal when there is none. It says what the change is meant to do.
2. Read the project's `CLAUDE.md` and the guidelines it points to.
3. Read the whole diff against the base branch.
4. Read the code around each change: the callers, the functions it calls and the existing code that does something similar. A diff alone cannot show that a change fits the system.

## What to Look For

In this order:

1. **Intent.** Does the change do what the description says, and all of it? Which cases does it miss, such as empty input, a failed request, a missing permission or two requests at once?
2. **Correctness.** Bugs you can show with a concrete input or sequence of events.
3. **Fit with the system.** The change may be correct on its own and still wrong for the codebase:
   - It adds a helper, type or component that already exists.
   - It goes around an existing layer, such as reading the database outside the service that owns it.
   - It solves the problem differently from the same problem elsewhere.
   - It makes something synchronous that was asynchronous, or adds a sleep or a retry to hide a timing problem.
4. **Errors and security.** Swallowed errors, personal data in logs, secrets in code, a new endpoint without an authorisation check, input that is used without validation.
5. **Tests.** Would the tests fail if the behaviour broke? Check them against the Test Quality section of the testing guideline. Look hard at any test the change edits or deletes: was the test wrong, or was it changed to pass?
6. **Weakened checks.** A new `eslint-disable`, `@ts-ignore`, `@ts-expect-error`, `as any`, skipped test or looser config needs a stated reason.
7. **Scope.** Changes that the description does not explain.

## What to Leave Out

- Anything `check` already blocks: formatting, lint, types and unused code.
- Style preferences and naming opinions that no guideline backs.
- Praise, summaries of the diff and general advice.
- Problems in code the change does not touch, unless the change makes them worse.

## Findings

Report a finding only after you have checked it in the code. If you could not confirm it, leave it out, or mark it as a question.

Each finding has:

- The file and line.
- What is wrong, in one sentence.
- A concrete case where it fails: the input or the steps, and the wrong result.
- The fix you suggest, when you have one.
- A level: **blocking** for a bug, a security or data problem or a broken guideline; **non-blocking** for everything else.

Report at most ten findings, the most serious first. A few findings that hold are worth more than many that might.

## Risk Level

Work out the risk level from the Risk Levels section of the pull request guideline and the high-risk paths in the project's `project.md`. When the description names a lower level than the changed files call for, say so; that is a blocking finding.

## Report

End with a summary of at most five lines:

- The risk level, and the reason in a few words.
- The number of blocking and non-blocking findings.
- What you could not check, such as behaviour that only shows in a deployed environment.

With no findings, say so in one line. Do not invent findings to fill the report.

Where the report goes depends on who asked. In a pull request workflow, post each finding as an inline comment on its line and the summary as one comment on the pull request. Anywhere else, give the findings and the summary in your reply.
