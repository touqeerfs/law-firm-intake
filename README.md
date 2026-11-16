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

- **Shared vs feature code**: `components/ui` knows nothing about contacts, so it could move to another app unchanged, and it never imports from `features/`. Anything that knows the domain (a status pill, the pipeline card, the record) lives in its feature folder next to the model, rules and hooks it uses.
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
- **Quick look keeps your place.** Clicking a card or row opens the record in a drawer (a bottom sheet on mobile) instead of leaving the page, so the board's scroll and the list's filters stay put. J/K step through what's on screen; Cmd/Ctrl-click still opens the full record.
- **Insights sit above the board.** Follow-ups due, awaiting first contact, median first response and 30-day retention are computed from the same data. The first two are filters, kept in the URL.
- **Keyboard first.** ⌘/Ctrl+K searches contacts and runs commands; `/`, `N`, `G P`, `G C` and `?` cover the rest, and are ignored while typing.
- **Every screen has its own loading, empty and error states**, reachable through the demo controls.
- **Own design tokens.** Tailwind's default palette is removed, so only the project's tokens exist. Dark mode only swaps token values, with no `dark:` classes in components. Bricolage Grotesque for headings, Figtree for UI, JetBrains Mono for IDs.

## One tradeoff and what I'd improve

**Tradeoff**: data lives in localStorage behind an async repository instead of a real backend such as Supabase. It needs no keys or setup and the live link can't break because a free database paused. The cost is that nothing is shared between devices or people. Because the UI only talks to the repository's async interface, with simulated latency and failures, moving to a real API means replacing one module.

**What I'd improve next**

- A Supabase adapter for the repository, plus Realtime so a shared desk sees moves as they happen.
- Sign-in and roles (coordinator, attorney).
- Manual card reordering, only if users ask for it.
- Deeper tests: component tests for the board and form, and more e2e journeys.

## How I used AI tools

I used AI throughout, as the brief allows: I directed the work and AI did most of the drafting and coding.

- **Planning.** I described the product and the decisions I wanted. AI drafted a throwaway vanilla-JS prototype (look, spacing and copy), a PRD and 14 issues (10 core, 4 optional), each with acceptance criteria. I reviewed and approved them before any app code was written.
- **Rules.** `CLAUDE.md` fixes the architecture, code rules and test seams that every session had to follow.
- **Building.** Claude Code built one issue per session. I read each diff before it was committed. Typecheck, lint, 32 unit tests and 2 Playwright specs ran before each commit, plus checks at desktop width and 390px.
- **Review.** Each issue ended with an AI review of its diff against the issue and the code rules. Fixes landed as their own `fix(...)` commits.
- **Decisions** are recorded in `docs/DECISIONS.md` and `docs/adr/`.
