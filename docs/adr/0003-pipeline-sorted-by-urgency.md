# Pipeline columns are sorted by urgency, not by hand

Lead and Active columns sort by soonest follow-up first; Closed sorts by most recently closed. A dropped card lands in its sorted position, and the drop preview shows exactly where. On an intake desk, card position should mean "who to call next"; a manual order goes stale within a day and needs an extra persisted rank field.

## Consequences

- Each column shows its sort rule, so the landing position is never a surprise.
- Reopening a closed contact sets the follow-up to today, otherwise it would sink to the bottom with no follow-up date.
