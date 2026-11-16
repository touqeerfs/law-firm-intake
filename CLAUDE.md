# Law Firm Intake — Mini CRM

Take-home case study for a Senior Frontend Engineer role. A small CRM for a law firm's client-intake team: contacts list, contact record with activity timeline, create/edit forms, pipeline board, and loading/empty/error states everywhere. Deployed on Vercel. Data lives in the browser (localStorage).

Graded on: UX and visual judgement, code quality (structure, naming, reuse, types), product sense, and how well the author can explain every decision on a 30-minute call. **The author must be able to explain every line**, so simple and readable beats clever.

## Sources of truth

1. The current issue in `.scratch/mini-crm/issues/` and the PRD in `.scratch/mini-crm/PRD.md`
2. `CONTEXT.md` (domain words — use them in code and copy)
3. `docs/DECISIONS.md` and `docs/adr/` (do not contradict without asking)
4. Visual and copy reference: `.scratch/mini-crm/prototype/` (open `index.html`). Port the look, spacing and wording. Do not port its code; it is a throwaway vanilla-JS prototype.

## Commands

Filled in by issue 01 once the project is scaffolded: `dev`, `build`, `start`, `lint`, `typecheck`, `format`, `test`, `test:watch`, `e2e`.

## Architecture

```
src/
  app/                 routes only: thin pages that render a feature component
  components/ui/       design-system primitives (Button, Pill, Avatar, Field, Dialog…)
  components/layout/   app shell: sidebar, top bar, mobile tab bar, demo controls
  features/contacts/   model, schemas, rules, repository, query/mutation hooks, components
  features/pipeline/   board ordering rules and board components
  lib/                 small shared helpers (cx, dates)
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

- Unit tests (Vitest) only at the agreed seams: contact rules, contact form schema, contacts repository, board ordering. Tests sit next to the code as `*.test.ts`.
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
7. Write the walkthrough note (below).

### Walkthrough note

Write `.scratch/mini-crm/notes/<NN>-<slug>.md` in plain language for the author to study before the interview:

- **What was built** — 3–5 bullets.
- **File by file** — for every file created or changed: what it is for, then the important lines explained one by one (quote the line, then explain it), and why this approach over the obvious alternative.
- **Libraries and APIs used** — what each does here and why it was chosen.
- **Likely interview questions** — 6–10 questions with short, honest answers.
- **How to demo it** — the clicks to show this feature in 30 seconds.

## Agent skills

### Issue tracker

Local markdown files under `.scratch/` (git-ignored); no external PRs. See `docs/agents/issue-tracker.md`.

### Triage labels

Default vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
