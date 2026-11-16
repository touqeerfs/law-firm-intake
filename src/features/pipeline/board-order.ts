import type { Contact, Status, StatusMove } from '@/features/contacts/contact-model';
import { startOfDay } from '@/lib/dates';

type Compare = (a: Contact, b: Contact) => number;

const followUpTime = (contact: Contact) =>
  contact.followUpAt === null ? Infinity : Date.parse(contact.followUpAt);
const bySoonestFollowUp: Compare = (a, b) => followUpTime(a) - followUpTime(b);
const byName: Compare = (a, b) => a.name.localeCompare(b.name);

const columnOrder: Record<Status, Compare> = {
  lead: (a, b) =>
    bySoonestFollowUp(a, b) || Date.parse(b.createdAt) - Date.parse(a.createdAt) || byName(a, b),
  active: (a, b) =>
    bySoonestFollowUp(a, b) ||
    Date.parse(a.statusChangedAt) - Date.parse(b.statusChangedAt) ||
    byName(a, b),
  closed: (a, b) => Date.parse(b.statusChangedAt) - Date.parse(a.statusChangedAt) || byName(a, b),
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
