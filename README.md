# Engineering Standards

My personal, opinionated conventions and tooling for my TypeScript projects. It is public so my projects can install it without credentials; it is not open to contributions.

## Contents

| Path | Applies to |
|---|---|
| `guidelines/general.md` | All projects |
| `guidelines/files.md` | All projects |
| `guidelines/git.md` | All projects |
| `guidelines/components.md` | Frontends |
| `guidelines/hooks.md` | Frontends |
| `guidelines/styling.md` | Frontends |
| `guidelines/nestjs.md` | NestJS backends |
| `eslint/` | `base`, `next` and `nest` presets |
| `prettier.js` | All projects |
| `tsconfig/base.json` | All projects |

Project-specific facts stay in the project: its purpose, routes, deployment, brand tokens and components.

## Install

Install from a tag, so each project chooses when to update:

```bash
npm install --save-dev github:eweihs/engineering-standards#v1.0.0 eslint@9 prettier typescript
```

ESLint stays on 9 because `eslint-config-next` depends on plugins that do not support 10 yet.

## Configure

`eslint.config.mjs` in a Next.js project:

```js
import next from "@eweihs/engineering-standards/eslint/next";

export default next;
```

`eslint.config.mjs` in a NestJS project:

```js
import nest from "@eweihs/engineering-standards/eslint/nest";

export default nest;
```

`prettier.config.mjs`:

```js
export { default } from "@eweihs/engineering-standards/prettier";
```

`tsconfig.json`:

```json
{ "extends": "@eweihs/engineering-standards/tsconfig/base.json" }
```

## Claude Code

Point the project's `CLAUDE.md` at the guidelines that apply:

```md
Before making changes, read:

1. `.claude/guidelines/project.md`
2. `node_modules/@eweihs/engineering-standards/guidelines/general.md`
3. `node_modules/@eweihs/engineering-standards/guidelines/files.md`
```

## Changing the standards

Change this repo, tag a new version, then bump the tag in each project. A new lint rule reaches a project only when that project updates.

Project examples must stay neutral. If a rule only makes sense for one project, it belongs in that project.
