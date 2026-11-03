# Git Guidelines

## Commit Messages

Use Conventional Commits:

```txt
<type>(<scope>): <summary>
```

The scope is optional. Use it for the area of the product or code that changed.

Good:

```txt
feat(orders): add filtering per month
fix(checkout): reject expired discount codes
chore(deps): upgrade next to 16.4.4
```

Avoid:

```txt
fix stuff
orders: updates
WIP
```

## Types

- `feat` — new behaviour for users
- `fix` — a bug fix
- `refactor` — a code change that keeps behaviour the same
- `test` — tests only
- `docs` — documentation only
- `chore` — dependencies, tooling, infrastructure and everything else

## Summary

- Use the imperative mood: "add", not "added".
- Start in lower case, with no full stop at the end.
- Keep the whole first line to 72 characters or fewer.

## Body

Below the first line, leave a blank line and add a short changelog in bullets:

```txt
feat(orders): add filtering per month

- Add a month picker to the order overview
- Load orders per month instead of all at once
- Keep the selected month in the URL
```

Use one bullet per notable change, and include the reason when it is not obvious. Skip the bullets only when the first line already says everything, such as a single dependency bump.

Mark a breaking change with `!` and describe it in a bullet:

```txt
feat(api)!: require a code in error responses

- Return a stable error code alongside the message
- Breaking: clients must branch on the code, not the message
```

## Scope of a Commit

Each commit should contain one logical change. Keep mechanical changes, such as reformatting, in their own commit.
