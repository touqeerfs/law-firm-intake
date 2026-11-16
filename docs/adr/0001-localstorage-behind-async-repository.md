# Persist to localStorage behind an async repository

The brief allows a mock API, localStorage or a free backend. We store data in localStorage, but only through a repository with an async, promise-based interface (with simulated latency and failures), so the UI is written exactly as it would be against a real API and swapping in Supabase later means replacing one module.

## Considered Options

- **Supabase**: real multi-user data, but adds keys, row-level security and a free project that pauses when idle. That risks the mandatory live link for no assessment benefit.
- **Synchronous localStorage calls in components**: simplest, but loading and error states would be fake and every component would be coupled to storage.

## Consequences

- Each reviewer gets their own sample data in their own browser. Nothing is shared between devices.
- Stored JSON is treated as untrusted and parsed with Zod. Corrupt data shows an error state with a reset action instead of crashing.
