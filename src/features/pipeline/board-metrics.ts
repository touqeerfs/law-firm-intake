import {
  closeReasons,
  type Activity,
  type Contact,
  type Outcome,
} from '@/features/contacts/contact-model';
import { isDue, isNotContacted, isOverdue } from '@/features/contacts/contact-rules';
import { DAY_MS, HOUR_MS } from '@/lib/dates';

export const FIRST_RESPONSE_TARGET_MS = HOUR_MS;
const RETENTION_WINDOW_MS = 30 * DAY_MS;

export type BoardMetrics = {
  openCount: number;
  dueCount: number;
  overdueCount: number;
  notContactedCount: number;
  longestWaitMs: number | null;
  medianFirstResponseMs: number | null;
  withinTargetPercent: number | null;
  closedCount: number;
  outcomes: Record<Outcome, number>;
  retentionPercent: number | null;
};

function percent(part: number, total: number): number | null {
  return total === 0 ? null : Math.round((part / total) * 100);
}

function median(values: number[]): number | null {
  const sorted = values.toSorted((a, b) => a - b);
  const middle = sorted.length / 2;
  const lower = sorted[Math.ceil(middle) - 1];
  const upper = sorted[Math.floor(middle)];
  if (lower === undefined || upper === undefined) return null;
  return (lower + upper) / 2;
}

function firstResponseTimes(contacts: Contact[], activities: Activity[]): number[] {
  const firstTouchAt = new Map<string, number>();
  for (const activity of activities) {
    if (activity.type !== 'call' && activity.type !== 'email') continue;
    const at = Date.parse(activity.at);
    const earliest = firstTouchAt.get(activity.contactId);
    if (earliest === undefined || at < earliest) firstTouchAt.set(activity.contactId, at);
  }

  return contacts.flatMap((contact) => {
    const touchedAt = firstTouchAt.get(contact.id);
    return touchedAt === undefined ? [] : [touchedAt - Date.parse(contact.createdAt)];
  });
}

export function boardMetrics(contacts: Contact[], activities: Activity[], now: Date): BoardMetrics {
  const waits = contacts
    .filter(isNotContacted)
    .map((contact) => now.getTime() - Date.parse(contact.createdAt));
  const responseTimes = firstResponseTimes(contacts, activities);
  const withinTarget = responseTimes.filter((time) => time <= FIRST_RESPONSE_TARGET_MS);

  const closedRecently = contacts.filter(
    (contact) =>
      contact.status === 'closed' &&
      now.getTime() - Date.parse(contact.statusChangedAt) <= RETENTION_WINDOW_MS,
  );
  const outcomes: Record<Outcome, number> = { won: 0, lost: 0, declined: 0 };
  for (const contact of closedRecently) {
    if (contact.closeReason) outcomes[closeReasons[contact.closeReason].outcome] += 1;
  }

  return {
    openCount: contacts.filter((contact) => contact.status !== 'closed').length,
    dueCount: contacts.filter(isDue).length,
    overdueCount: contacts.filter(isOverdue).length,
    notContactedCount: waits.length,
    longestWaitMs: waits.length === 0 ? null : Math.max(...waits),
    medianFirstResponseMs: median(responseTimes),
    withinTargetPercent: percent(withinTarget.length, responseTimes.length),
    closedCount: closedRecently.length,
    outcomes,
    retentionPercent: percent(outcomes.won, closedRecently.length),
  };
}
