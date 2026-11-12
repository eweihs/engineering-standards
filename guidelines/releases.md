# Release Guidelines

## Every Prod Release Is a Tag

Prod only runs code from a tag. A tag names the exact commit that was tested, so "what is in prod?" has one answer, and a rollback is a redeploy of the previous tag.

## Flow

1. Merge to `main`.
2. Deploy that commit of `main` to a non-prod environment.
3. Run `test:e2e` and `test:visual` against it.
4. Bump the version on that same commit with `npm version`, which also creates the tag.
5. Deploy the tag to prod.
6. Run read-only checks on prod.

Release the commit that passed the tests, not the latest commit on `main`. The release commit that `npm version` adds changes only the version fields, so the code in the tag is the code that was tested. When `main` has moved on in the meantime, release from a branch at the tested commit (see Hotfixes and Late Releases).

## Versions

Use SemVer with a `v` prefix: `v1.4.0`. The commits since the last tag decide the bump:

| Commits since the last tag | Bump |
|---|---|
| Any breaking change (`!`) | Major |
| Any `feat` | Minor |
| Anything else | Patch |

## Creating a Tag

The tag and the `version` in `package.json` always match. Never create a release tag with `git tag` or edit the version by hand: `npm version` changes `package.json` and `package-lock.json`, commits them and creates an annotated tag, in one step.

```sh
git switch main && git pull --ff-only
npm version minor -m "chore(release): %s"
git push --follow-tags
```

`%s` becomes the new version, and the tag is `v` plus that version. Pass `major`, `minor` or `patch` as the table above says.

`npm version` refuses to run with uncommitted changes. Leave that check on.

Create a GitHub release from the tag. Its notes are the changelog: the bullets of the commits since the last tag, grouped by type.

```md
Features
- Add filtering per month to the order overview

Fixes
- Reject expired discount codes at checkout
```

A person creates the tag; it is the decision to release. An agent may draft the changelog.

The prod deploy refuses to run when the tag does not equal `v` plus the `version` in `package.json`.

## Hotfixes and Late Releases

A hotfix goes through `main` and this same flow, as a patch release.

When `main` has moved past the tested commit, branch from it, run `npm version` there, and push the branch with its tag. Merge that branch back to `main` so the version on `main` keeps up.

## Rules

- A tag is never moved or deleted. Fix a bad release with a new patch tag.
- Protect `v*` tags with a GitHub tag ruleset: only maintainers create them, and nobody updates or deletes them.
- The `main` branch ruleset lets maintainers push the release commit directly. That commit changes only the version, so it needs no pull request.
- Roll back by deploying the previous tag, then fix forward.
- The deploy shows which tag it runs, for example in a health endpoint or the page footer.
