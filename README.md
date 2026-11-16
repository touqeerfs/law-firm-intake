# Intake Desk

A small CRM for a law firm's client-intake team: log inquiries, follow up, and move each one to an outcome.

Live: https://law-firm-intake-seven.vercel.app

## How to run tests

```bash
npm test                          # unit tests (Vitest)
npx playwright install chromium   # once, before the first e2e run
npm run e2e                       # builds the app, serves it on port 3100, runs the two Playwright specs
```

Each e2e test opens a fresh browser context, so storage starts empty and the app seeds the sample contacts on first load.
