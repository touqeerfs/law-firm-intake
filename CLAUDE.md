# Law Firm Intake — Mini CRM

A small CRM for a law firm's client-intake team: contacts list, contact record with activity timeline, create/edit forms, pipeline board, and loading/empty/error states everywhere. Deployed on Vercel. Data lives in the browser (localStorage).

Simple and readable beats clever.

## Sources of truth

1. The current issue in `.scratch/mini-crm/issues/` and the PRD in `.scratch/mini-crm/PRD.md`
2. `CONTEXT.md` (domain words — use them in code and copy)
3. `docs/DECISIONS.md` and `docs/adr/` (do not contradict without asking)
4. Visual and copy reference: `.scratch/mini-crm/prototype/` (open `index.html`). Port the look, spacing and wording. Do not port its code; it is a throwaway vanilla-JS prototype.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Next dev server (Turbopack) on http://localhost:3000 |
| `npm run build` | Production build (also type-checks routes) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint, then `prettier --check .` |
| `npm run typecheck` | `next typegen` (route types such as `PageProps`), then `tsc --noEmit` |
| `npm run format` | `prettier --write .` |
| `npm test` | Vitest once (`src/**/*.test.ts`, passes with no tests) |
| `npm run test:watch` | Vitest in watch mode |
| `npm run e2e` | Playwright, Chromium desktop; builds and starts the app itself. First run `npx playwright install chromium` |

Before each commit: `npm run typecheck && npm run lint && npm test`.

## Architecture

```
src/
  app/                 routes only: thin pages that render a feature component
  components/ui/       design-system primitives (Button, Pill, Avatar, Field, Dialog…)
  components/layout/   app shell: sidebar, top bar, mobile tab bar, demo controls
  features/contacts/   model, schemas, rules, repository, query/mutation hooks, components
  features/pipeline/   board ordering, board metrics and board components
  lib/                 small shared helpers (cx, dates, text, theme, keyboard)
e2e/                   Playwright specs
```

- Data flow: component → hook (`useContacts`, `useContact`, `useContactMutations`) → repository → localStorage. Components never touch storage.
- Zod schemas are the source of truth; types come from `z.infer`.
- Data components are client components (`'use client'`). Keep `'use client'` at the leaves where possible.

## Code rules

- No comments that explain *what* code does. A short comment is allowed only for a non-obvious *why*. No JSDoc blocks, no banner comments, no commented-out code.
- Named exports only (except Next.js files that require a default export). Kebab-case file names.
- No `any`, no non-null `!`, no `as` casts except `as const` or right after a Zod parse.
- Props get a named type. Components stay under ~150 lines; split when they grow.
- Three similar blocks become one component or helper. Do not add abstractions for needs the issue does not have.
- Use domain names from `CONTEXT.md` (`Contact`, `Status`, `closeReason`, `followUpAt`…).
- Styling only with design tokens defined in `globals.css`. No hex colours or arbitrary values in components.
- No new dependencies beyond `docs/DECISIONS.md` without asking. Never `eslint-disable`, skip tests or weaken TypeScript settings to make checks pass.
- No `console.log` left in code.
- User-facing copy comes from the prototype or matches its tone: specific to a law firm's intake desk, no emoji, no marketing words.

## Testing rules

- Unit tests (Vitest) only at the agreed seams: contact rules, contact form schema, contacts repository, board ordering, board metrics. Tests sit next to the code as `*.test.ts`.
- Test behaviour through the public function, not internals. Expected values are literals, not recomputed.
- E2E (Playwright, Chromium): only the two specs in issue 09. No drag-and-drop in e2e.
- Keep tests short and readable; each one should be explainable in a sentence.

## Workflow for each session

1. One issue per session. Read the issue, the PRD, this file, `CONTEXT.md` and `docs/DECISIONS.md` first.
2. Record the starting commit (`git rev-parse HEAD`); it is the fixed point for `/code-review`.
3. Build only what the issue's acceptance criteria ask for.
4. Before committing: `npm run typecheck`, `npm run lint`, `npm test` must pass. Check the UI in a browser at desktop width and 390px.
5. Commit in small Conventional Commits (`feat(contacts): …`, `fix(pipeline): …`, `test(…)`, `docs(…)`, `chore(…)`), 3–6 per issue. Never squash, never push unless asked.
6. Set the issue's `Status:` to `done` and tick its acceptance criteria.
