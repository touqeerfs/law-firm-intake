# Decisions

One line per decision. Bigger, hard-to-reverse ones also have an ADR in `docs/adr/`.

| Area | Decision | Why | Rejected |
|---|---|---|---|
| Framework | Next.js App Router, TypeScript `strict` + `noUncheckedIndexedAccess` | Preferred by the brief; strict types are graded ("use of types") | Pages Router, Vite SPA |
| Persistence | localStorage behind an async repository (ADR 0001) | Allowed by the brief, zero setup, swappable | Supabase, sync calls in components |
| Data layer | TanStack Query: `useContacts` / `useContact` reads, `useContactMutations` writes (ADR 0002) | Loading/error/retry/optimistic updates built in | Zustand persist, Redux |
| Types | Zod schemas are the source of truth; types come from `z.infer` | One definition for validation and types | Hand-written interfaces + manual checks |
| Stored data | Parsed with Zod as `unknown` on every read | localStorage can be edited or stale | Trusting `JSON.parse` output |
| Forms | react-hook-form + `zodResolver`, mode `onTouched` | Validate on blur, then live while fixing; focuses first error | Controlled `useState` per field |
| Styling | Tailwind v4 `@theme` tokens, default palette removed (ADR 0005) | Design-system discipline, no stray colours | shadcn defaults, CSS modules |
| Primitives | Hand-built, typed variant maps + `cx()`; Radix for Dialog, DropdownMenu, Popover | Accessible focus handling without a heavy kit | Full component library |
| Drag and drop | `@dnd-kit/core` with pointer + keyboard sensors | Accessible, keyboard support, screen-reader announcements | Native HTML5 drag (no keyboard/touch) |
| Board order | Sorted by urgency, drop preview shows landing slot (ADR 0003) | Position means "who to call next" | Manual order with persisted rank |
| Toasts | `sonner` | Small, accessible, supports an Undo action | Hand-built toast queue |
| Icons | `lucide-react` | Consistent stroke icons, tree-shaken | Inline SVG strings |
| Fonts | `next/font`: Bricolage Grotesque (headings), Figtree (UI), JetBrains Mono (IDs) | Self-hosted, no layout shift, distinctive | Inter/Geist (generic) |
| Dates | ISO strings in storage, formatting with `Intl` in `lib/dates` | JSON-safe, no date library needed | date-fns, epoch numbers |
| Filters | List search/tab/sort live in URL search params | Shareable, survive refresh, back button works | Component state only |
| Latency | Repository waits 300–500 ms; demo controls switch to slow/failing | Makes loading and error states visible to reviewers | Instant responses |
| Optimistic UI | Board moves update the cache in `onMutate`, roll back in `onError`; pending notes render from mutation variables | Instant feedback, honest failure | Wait for every save |
| Unsaved changes | `beforeunload` + confirm on Cancel; quick look confirms before dropping a composer draft | App Router has no route-change events to block | Custom router wrapper |
| Quick look | Radix Dialog drawer rendering the same `ContactRecord`; the record lays out with container queries | Triage without losing scroll or filters; one record for page and drawer | A separate preview component, viewport breakpoints |
| Insights | Pure functions in `board-metrics.ts` over the contacts and activities queries; tile filter in the URL (`?focus=due`) | One source of data, unit-tested, shareable view | Stored counters, a separate stats store |
| Theme | `data-theme` on `<html>` swaps token values; inline script sets it before paint; default from `prefers-color-scheme`, choice kept in localStorage | No flash on load, no `dark:` classes in components | `next-themes`, Tailwind `dark:` variants |
| Command palette | Hand-built on Radix Dialog with the list's search rules; global shortcuts ignored while typing or with a dialog open | No new dependency, same matching as the list | `cmdk` |
| Unit tests | Vitest at agreed seams only: contact rules, form schema, repository, board ordering, board metrics | Cover logic, not markup | Component snapshot tests |
| E2E | Playwright, Chromium desktop, 2 specs | Prove the two critical journeys | Multi-browser matrix, drag in e2e |
| Lint/format | ESLint flat config (next core-web-vitals + typescript), Prettier + Tailwind plugin | Consistent code, sorted classes | — |
| Commits | Conventional Commits, small and per logical step | Readable history (brief forbids one squashed commit) | — |
| Not built | Backend, auth, realtime (ADR 0004), manual card order | Not requested | — |
