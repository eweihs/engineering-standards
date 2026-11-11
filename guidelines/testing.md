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
| While working | `test:unit`, `tsc` |
| Before every PR | `tsc`, `lint`, `lint:unused`, `format:check`, `test:unit`, `test:integration` |
| Frontend refactor or styling change | `test:visual:update` on `main`, then `test:visual` on the branch |
| After every deploy to a non-prod environment, frontend or backend | `test:e2e` |
| After a prod deploy | Read-only checks only; never tests that write data |

Running `test:e2e` after every non-prod deploy also catches mocks that have drifted from the real API.

Projects without CI on pull requests run all of this locally, via a checklist in their PR template.

## Which Test to Write

- Pure logic: a unit test.
- A new or changed page or flow: an integration test.
- A new or changed endpoint: an integration test.
- Behaviour only the real backend shows, such as bookings, invoices or mail: an e2e test as well. Keep these few, because they write to a shared environment.
- A bug fix: a test that fails without the fix, at the lowest level that can reproduce the bug.
- Before refactoring code that has no test, add one.

## Test Data

Use fixtures only. Never real or personal data, in any kind of test.
