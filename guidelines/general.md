# General Guidelines

## Principles

- Prefer the simplest solution.
- Modify existing code before introducing abstractions.
- Keep projects lightweight.
- Avoid premature abstractions, over-engineered patterns and generic frameworks.

When guidelines conflict:

1. Project requirements win.
2. Simplicity wins.
3. Reuse existing patterns already present in the codebase.

## Rules Advise, Checks Block

A guideline is advice; people and agents can miss it. If something must never happen, enforce it with a lint rule, a type, a test or a CI step, and keep the guideline only for the reason behind it.

When a review catches the same mistake twice, look for a check that would have caught it first.

## Dependencies

Add a dependency only when it clearly earns its place. Tools that are only needed during development belong in `devDependencies`.

## TypeScript

Use strict mode. Avoid `any`; prefer `unknown` and narrow it.

## Error Handling

Do not swallow errors. A catch block must handle the error, report it, or rethrow it.

Returning an empty value from a catch block hides failures: an API outage then looks like "no data". Build-time data fetching must fail the build rather than produce a partial site.

When you throw a new error from a catch block, pass the original as its `cause`:

```ts
throw new Error("Could not load orders", { cause: error });
```

Await or return every promise. A promise nobody awaits fails silently.

## Sensitive Data

Never commit:

- Secrets, keys or credentials
- Database backups or exports
- Real user data, including password hashes

Seed and fixture data must be synthetic.

## Logging

Personal data does not belong in logs, in any environment.

Never log:

- Names, email addresses, phone numbers or addresses
- Anything a user wrote or uploaded, such as messages, documents or payment details
- Request or response bodies
- Whole objects from the database
- URLs containing personal data or keys

Log IDs and error details instead:

```ts
console.log(`Email sent to customer ${customer.id}`);
```

## Dead Code

Delete unused files, exports, dependencies and code paths instead of keeping them "just in case". Git has the history.

Do not comment code out; delete it.

Code that looks unused but is kept on purpose, such as a feature flag that is off, says why in a comment.

Every project has a `lint:unused` script that runs [knip](https://knip.dev) with the shared `knip/next` or `knip/nest` preset:

```json
"lint:unused": "knip"
```

Run it before every PR, next to `lint`. ESLint only finds unused code within a file; knip also finds unused files, exports and dependencies.

## Comments

Explain why, not what. Remove comments that restate the code.
