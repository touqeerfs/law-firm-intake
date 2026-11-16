import type { Contact, Status, StatusMove } from '@/features/contacts/contact-model';
import { byName, timeOrLast, type Compare } from '@/features/contacts/contact-rules';
import { startOfDay } from '@/lib/dates';

const bySoonestFollowUp: Compare = (a, b) => timeOrLast(a.followUpAt) - timeOrLast(b.followUpAt);

const columnOrder: Record<Status, Compare> = {
  lead: (a, b) =>
    bySoonestFollowUp(a, b) || Date.parse(b.createdAt) - Date.parse(a.createdAt) || byName(a, b),
  active: (a, b) =>
    bySoonestFollowUp(a, b) ||
    Date.parse(a.statusChangedAt) - Date.parse(b.statusChangedAt) ||
    byName(a, b),
  closed: (a, b) => Date.parse(b.statusChangedAt) - Date.parse(a.statusChangedAt) || byName(a, b),
};

export const columnSortHints: Record<Status, string> = {
  lead: 'Soonest follow-up first',
  active: 'Soonest follow-up first',
  closed: 'Most recently closed first',
};

export function boardColumns(contacts: Contact[]): Record<Status, Contact[]> {
  const column = (status: Status) =>
    contacts.filter((contact) => contact.status === status).toSorted(columnOrder[status]);
  return { lead: column('lead'), active: column('active'), closed: column('closed') };
}

export function isReopen(contact: Contact, to: Status): boolean {
  return contact.status === 'closed' && to !== 'closed';
}

// A reopened contact gets a follow-up today, otherwise it would sink to the bottom of its column
function followUpAfterMove(contact: Contact, to: Status, now: Date): string | null {
  if (to === 'closed') return null;
  if (isReopen(contact, to) && contact.followUpAt === null) return startOfDay(now).toISOString();
  return contact.followUpAt;
}

export function applyMove(contact: Contact, move: StatusMove, now: Date): Contact {
  return {
    ...contact,
    status: move.to,
    closeReason: move.to === 'closed' ? move.closeReason : null,
    followUpAt: followUpAfterMove(contact, move.to, now),
    statusChangedAt: now.toISOString(),
  };
}
