# Testing Guidelines

## Kinds of Tests

Name test scripts after the kind of test, so the name says what a run proves.

| Script | What it tests | Against |
|---|---|---|
| `test:unit` | Pure logic | Nothing; no browser, no network |
| `test:integration` | Pages or flows in a browser | A mocked API |
| `test:e2e` | The whole system through the UI | A deployed non-prod environment with a real backend |
| `test:visual` | Screenshots and markup | A local baseline |

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

Browser tests live under a root `tests/` folder:

```txt
tests/
  integration/
  e2e/
  visual/
```

The project's own `project.md` names the environments, accounts and test-data cleanup that `test:e2e` uses.

## When to Run What

| Moment | Run |
|---|---|
| While working | `test:unit`, `tsc` |
| Before every PR | `tsc`, `lint`, `format:check`, `test:unit`, `test:integration` |
| Refactor or styling change | `test:visual:update` on `main`, then `test:visual` on the branch |
| After every deploy to a non-prod environment, frontend or backend | `test:e2e` |
| After a prod deploy | Read-only checks only; never tests that write data |

Running `test:e2e` after every non-prod deploy also catches mocks that have drifted from the real API.

Projects without CI on pull requests run all of this locally, via a checklist in their PR template.

## Which Test to Write

- Pure logic: a unit test.
- A new or changed page or flow: an integration test.
- Behaviour only the real backend shows, such as bookings, invoices or mail: an e2e test as well. Keep these few, because they write to a shared environment.
- A bug fix: a test that fails without the fix, at the lowest level that can reproduce the bug.
- Before refactoring code that has no test, add one.

## Test Data

Use fixtures only. Never real or personal data, in any kind of test.
