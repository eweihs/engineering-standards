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

## Dependencies

Add a dependency only when it clearly earns its place. Tools that are only needed during development belong in `devDependencies`.

## TypeScript

Use strict mode. Avoid `any`; prefer `unknown` and narrow it.

## Error Handling

Do not swallow errors. A catch block must handle the error, report it, or rethrow it.

Returning an empty value from a catch block hides failures: an API outage then looks like "no data". Build-time data fetching must fail the build rather than produce a partial site.

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

## Comments

Explain why, not what. Remove comments that restate the code.
