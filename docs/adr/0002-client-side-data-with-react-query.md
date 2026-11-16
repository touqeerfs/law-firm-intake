# Client-side data with React Query in the App Router

localStorage only exists in the browser, so pages render a client component that loads data through TanStack Query hooks (one query hook and one mutation hook per entity). Server components are used for layout and route shells only. This avoids hydration mismatches and gives loading, error, retry and optimistic-update behaviour without hand-written state machines.

## Considered Options

- **Zustand with `persist`**: less code, but data is synchronous, so loading and error states would have to be faked, and there would be no cache invalidation story.
- **Server components + server actions**: the idiomatic App Router path for a real database, but the server can't read the browser's localStorage.
