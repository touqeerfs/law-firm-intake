# Issue tracker: Local Markdown

Issues and PRDs for this repo live as markdown files in `.scratch/` (git-ignored, local planning only).

## Conventions

- One feature per directory: `.scratch/<feature-slug>/`
- The PRD is `.scratch/<feature-slug>/PRD.md`
- Implementation issues are `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, numbered from `01`
- Triage state is a `Status:` line near the top of each issue file (see `triage-labels.md`)
- Comments and history append to the bottom of the file under `## Comments`
- Session walkthroughs (what was built and why) go in `.scratch/<feature-slug>/notes/<NN>-<slug>.md`

## When a skill says "publish to the issue tracker"

Create a new file under `.scratch/<feature-slug>/`.

## When a skill says "fetch the relevant ticket"

Read the file at the referenced path. The user will normally pass the path or the issue number directly.

## Closing an issue

Set `Status: done` and tick the acceptance criteria that are met.
