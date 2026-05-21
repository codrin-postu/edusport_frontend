# Contributing

## Overview

Short guide for working on the frontend. Read `ARCHITECTURE.md` first if
you are touching data fetching or caching.

## Branching

- Branch off `main`. Name branches `feat/<thing>`, `fix/<thing>`,
  `refactor/<thing>`, etc.
- Open a pull request against `main`. Never push to `main` directly.
- Keep PRs small and focused. A PR that changes more than one concern
  should be split.

## Commit messages

Imperative present tense, prefixed with a type:

- `feat:` new user-visible behaviour
- `fix:` bug fix
- `refactor:` no behaviour change
- `perf:` measurable performance work
- `chore:` tooling, deps, build
- `docs:` documentation only

Examples:

```
feat: add booking calendar to /cursuri
fix: handle missing OpenGraph image on noutati slug
refactor: extract Strapi fetch helpers into src/lib/strapi.ts
```

## Code style

- ESLint and Prettier are authoritative. Run `npm run lint` before opening
  a PR. The repo includes a `.prettierrc` — editors should pick it up
  automatically.
- TypeScript: prefer explicit types on exported functions. Internal helpers
  may rely on inference.
- React: server components by default. Add `"use client"` only when you
  need state, effects, or browser APIs.

## Local checks (run before pushing)

```bash
npx tsc --noEmit
npm run lint
npm run build
```

`npm run build` catches a lot of issues that `tsc` misses (server/client
boundaries, missing image hosts, etc.).

## Pull request template

When opening a PR, include:

- **What** — one-paragraph summary of the change.
- **Why** — the motivation, ticket link if applicable.
- **Screenshots** — required for any visible UI change. Light and dark
  variants if relevant.
- **Manual test steps** — the exact clicks/URLs a reviewer should hit.
- **Risk** — anything that could break in production (cache, env, third
  parties).

## Reviewing

- Prefer comments over questions in chat.
- Use "request changes" only for blockers. Style nits should be
  suggestions.
- Reviewers should pull the branch and run it locally for non-trivial UI
  work.
