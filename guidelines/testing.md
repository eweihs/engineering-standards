# Testing Guidelines

## Kinds of Tests

Name test scripts after the kind of test, so the name says what a run proves.

| Script | What it tests | Against |
|---|---|---|
| `test:unit` | Pure logic | Nothing; no browser, no network |
| `test:integration` | One side of the system working as a whole | See below |
| `test:e2e` | The whole system through the UI | A deployed non-prod environment with a real backend |
| `test:visual` | Screenshots and markup (frontends only) | A local baseline |

What `test:integration` means depends on the side:

- **Frontend:** pages or flows in a browser, with the API mocked.
- **Backend:** API endpoints over HTTP, against a real local test database, with outside services such as mail or payments mocked.

Supporting scripts:

- `test` — an alias for `test:unit`
- `test:visual:update` — save the visual baseline
- `test:visual:report` — open the visual report
- `test:e2e:report` — open the e2e report

Reserve the word "e2e" for runs against a real backend. A browser test with a mocked API is an integration test.

Never run `test:e2e` against prod.

## Where Tests Live

Unit tests sit next to the code they test:

```txt
src/lib/price.ts
src/lib/price.test.ts
```

Integration, e2e and visual tests live under a root `tests/` folder, with one subfolder per kind the project has:

```txt
tests/
  integration/
  e2e/
  visual/
```

A backend has no `visual/`.

E2e tests live in one repo, usually the frontend, because they drive the UI. A backend does not keep its own copy; its deploys trigger the same suite.

The project's own `project.md` names the environments, accounts and test-data cleanup that `test:e2e` uses.

## When to Run What

| Moment | Run |
|---|---|
| While working | `test:unit`, `typecheck` |
| Before every PR, and in CI on every PR | `check` |
| Frontend refactor or styling change | `test:visual:update` on `main`, then `test:visual` on the branch |
| After every deploy to a non-prod environment, frontend or backend | `test:e2e` |
| Before tagging a release, on the non-prod deploy of that commit | `test:e2e`, `test:visual` |
| After a prod deploy | Read-only checks only; never tests that write data |

Running `test:e2e` after every non-prod deploy also catches mocks that have drifted from the real API.

`check` runs `typecheck`, `lint`, `lint:unused`, `format:check`, `test:unit` and `test:integration`, in that order, and stops at the first failure.

Every project runs `check` in CI on pull requests that are ready for review, through the shared `check.yml` workflow. Draft pull requests do not run it. A pull request merges only when it is green. Keep the run under five minutes; a slow check gets skipped.

## Which Test to Write

- Pure logic: a unit test.
- A new or changed page or flow: an integration test.
- A new or changed endpoint: an integration test.
- Behaviour only the real backend shows, such as bookings, invoices or mail: an e2e test as well. Keep these few, because they write to a shared environment.
- A bug fix: a test that fails without the fix, at the lowest level that can reproduce the bug.
- Before refactoring code that has no test, add one.

## Test Quality

A test earns its place when it fails once the behaviour breaks. A test that cannot fail is worse than no test, because it looks like coverage. More tests is not the goal.

ESLint blocks these in every test file:

- A test without an assertion. A helper that asserts has a name starting with `expect`, such as `expectInvoice`, so lint can see it.
- `.only` and `.skip`. Playwright's `test.skip(condition, reason)` inside a test stays allowed, such as for a mobile-only check.
- Commented-out tests. Delete them.
- An `expect` inside an `if` or a `catch`, which may never run.
- Empty or duplicate test titles.
- In Playwright: a fixed wait such as `waitForTimeout`, and an assertion without `await`. Wait for what the user would see instead.

Lint cannot see the rest, so the author and the reviewer check it:

- The title names the behaviour, and the test asserts exactly that.
- Assert the outcome, not the implementation. Check the returned value or what the user sees, not that an internal function was called.
- Do not mock the thing under test. Mock only at the edge: the network, the clock and outside services.
- Do not compute the expected value with the same formula as the code. Write it out.
- Do not test code without logic, such as getters, constants, re-exports or the framework itself.

When a test fails after a change, decide which of the two is wrong. Never change or delete a test only to make it pass; when an expectation has to change, the commit says why.

For a bug fix, watch the new test fail before applying the fix.

## Test Data

Use fixtures only. Never real or personal data, in any kind of test.
