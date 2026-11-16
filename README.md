# Intake Desk

A small CRM for a law firm's client-intake team: log inquiries, follow up, and move each one to an outcome.

## Live app

https://law-firm-intake-seven.vercel.app

Data is stored in your browser, so each reviewer starts with their own 19 sample contacts. **Demo controls** (top bar, dashed button) switch the simulated network to slow or failing and reset, empty or corrupt the stored data, so every loading, empty and error state can be seen.

## Run locally

```bash
npm install
npm run dev                       # http://localhost:3000
npm test                          # unit tests (Vitest)
npx playwright install chromium   # once, before the first e2e run
npm run e2e                       # builds the app, serves it on port 3100, runs the two Playwright specs
```

## Component structure and state management

```
src/app/                routes only: thin pages that render a feature component
src/components/ui/      primitives: Button, Pill, Avatar, Field, Dialog…
src/components/layout/  app shell: sidebar, top bar, mobile tab bar, demo controls
src/features/contacts/  model, schemas, rules, repository, hooks, components
src/features/pipeline/  board ordering rules and board components
src/lib/                small helpers (cx, dates, text)
```

- **Data flow**: component → hook (`useContacts`, `useContact`, `useContactMutations`) → repository → localStorage. Components never touch storage.
- **Server-like state** (contacts, activities) lives in TanStack Query: loading, error, retry and optimistic board moves with rollback.
- **List filters** (search, tab, sort) live in URL search params, so a refresh or a shared link shows the same view.
- **Component state** is for UI only: open dialogs, drag state, draft notes.
- **Zod schemas are the source of truth.** Types come from `z.infer`, the form validates with the same schema, and stored JSON is parsed on every read.

## UI and UX decisions

- **The pipeline is sorted by urgency, not by hand.** Lead and Active show the soonest follow-up first, Closed shows the most recently closed. A dragged card shows exactly where it will land before the drop.
- **Closing needs a reason.** Every closed inquiry records why (Retained, Hired another firm…). Every move has Undo. Reopening schedules a follow-up for today so the contact isn't forgotten.
- **Attention signals.** "Not contacted" marks open inquiries with no call or email yet. Time in status shows a warning at 7 days and turns red as stalled at 14.
- **Forms validate on blur, then live while you fix.** Messages say what to do ("Add a phone number or email so the team can follow up"), and a summary on submit links to each field.
- **Every screen has its own loading, empty and error states**, reachable through the demo controls.
- **Own design tokens.** Tailwind's default palette is removed, so only the project's tokens exist. Bricolage Grotesque for headings, Figtree for UI, JetBrains Mono for IDs.

## One tradeoff and what I'd improve

**Tradeoff**: data lives in localStorage behind an async repository instead of a real backend such as Supabase. It needs no keys or setup and the live link can't break because a free database paused. The cost is that nothing is shared between devices or people. Because the UI only talks to the repository's async interface, with simulated latency and failures, moving to a real API means replacing one module.

**What I'd improve next**

- A Supabase adapter for the repository, plus Realtime so a shared desk sees moves as they happen.
- Sign-in and roles (coordinator, attorney).
- Manual card reordering, only if users ask for it.
- Deeper tests: component tests for the board and form, and more e2e journeys.

## How I used AI tools

> **DRAFT: facts for the author to rewrite in their own words. Delete this line before submitting.**

- A throwaway vanilla-JS prototype set the look, spacing and copy before any app code. _(Say how it was made.)_
- A PRD and ten core issues (plus four optional ones), each with acceptance criteria, were written before building.
- Claude Code built each issue in its own session, following the rules in `CLAUDE.md`.
- Each issue ended with a review of its diff against the starting commit. Fixes landed as their own `fix(...)` commits.
- Every diff was read before committing. Typecheck, lint, 30 unit tests and 2 e2e specs ran before each commit, plus manual checks at desktop width and 390px.
- Decisions are recorded in `docs/DECISIONS.md` and `docs/adr/`.
