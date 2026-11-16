import { z } from 'zod';
import { calendarDaysBetween, DAY_MS, formatShortDate, formatWeekday } from '@/lib/dates';
import { digitsOnly, normalizeText } from '@/lib/text';
import type { Contact, Status } from './contact-model';

export const STATUS_WARNING_DAYS = 7;
export const STATUS_STALLED_DAYS = 14;

export type FollowUpTone = 'neutral' | 'warn' | 'danger';
export type TimeInStatusTone = 'neutral' | 'ok' | 'warn' | 'danger';

function daysUntilFollowUp(contact: Contact): number | null {
  if (contact.status === 'closed' || contact.followUpAt === null) return null;
  return calendarDaysBetween(new Date(), new Date(contact.followUpAt));
}

export function isDue(contact: Contact): boolean {
  const days = daysUntilFollowUp(contact);
  return days !== null && days <= 0;
}

export function isOverdue(contact: Contact): boolean {
  const days = daysUntilFollowUp(contact);
  return days !== null && days < 0;
}

export function isNotContacted(contact: Contact): boolean {
  return contact.status !== 'closed' && contact.lastContactedAt === null;
}

export function timeInStatus(contact: Contact): { days: number; tone: TimeInStatusTone } {
  const days = Math.floor((Date.now() - Date.parse(contact.statusChangedAt)) / DAY_MS);
  if (contact.status === 'closed') return { days, tone: 'neutral' };
  if (days >= STATUS_STALLED_DAYS) return { days, tone: 'danger' };
  if (days >= STATUS_WARNING_DAYS) return { days, tone: 'warn' };
  return { days, tone: 'ok' };
}

export function followUpLabel(contact: Contact): { label: string; tone: FollowUpTone } | null {
  const days = daysUntilFollowUp(contact);
  if (days === null || contact.followUpAt === null) return null;
  if (days < 0) return { label: `Overdue ${-days}d`, tone: 'danger' };
  if (days === 0) return { label: 'Due today', tone: 'warn' };
  if (days === 1) return { label: 'Tomorrow', tone: 'neutral' };
  if (days < 7) return { label: formatWeekday(contact.followUpAt), tone: 'neutral' };
  return { label: formatShortDate(contact.followUpAt), tone: 'neutral' };
}

const PHONE_SEARCH_MIN_DIGITS = 3;

export function matchesSearch(contact: Contact, query: string): boolean {
  const text = normalizeText(query.trim());
  if (text === '') return true;

  const fields = [contact.name, contact.email, contact.id, contact.referredBy];
  if (fields.some((field) => normalizeText(field).includes(text))) return true;

  const digits = digitsOnly(query);
  return digits.length >= PHONE_SEARCH_MIN_DIGITS && digitsOnly(contact.phone).includes(digits);
}

export const listViewSchema = z.enum(['all', 'due', 'not-contacted', 'lead', 'active', 'closed']);
export type ListView = z.infer<typeof listViewSchema>;

type ListViewDetails = {
  label: string;
  matches: (contact: Contact) => boolean;
  needsAttention?: boolean;
  status?: Status;
};

const hasStatus = (status: Status) => (contact: Contact) => contact.status === status;

export const listViews: Record<ListView, ListViewDetails> = {
  all: { label: 'All', matches: () => true },
  due: { label: 'Follow-up due', matches: isDue, needsAttention: true },
  'not-contacted': { label: 'Not contacted', matches: isNotContacted, needsAttention: true },
  lead: { label: 'Lead', matches: hasStatus('lead'), status: 'lead' },
  active: { label: 'Active', matches: hasStatus('active'), status: 'active' },
  closed: { label: 'Closed', matches: hasStatus('closed'), status: 'closed' },
};

export const contactSortSchema = z.enum([
  'newest',
  'follow-up',
  'last-contacted',
  'time-in-status',
  'name',
]);
export type ContactSort = z.infer<typeof contactSortSchema>;

export type Compare = (a: Contact, b: Contact) => number;

export const timeOrLast = (iso: string | null) => (iso === null ? Infinity : Date.parse(iso));
const timeOrFirst = (iso: string | null) => (iso === null ? -Infinity : Date.parse(iso));
export const byName: Compare = (a, b) => a.name.localeCompare(b.name);

export const contactSorts: Record<ContactSort, { label: string; compare: Compare }> = {
  newest: {
    label: 'Newest first',
    compare: (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
  },
  'follow-up': {
    label: 'Follow-up date',
    compare: (a, b) => timeOrLast(a.followUpAt) - timeOrLast(b.followUpAt) || byName(a, b),
  },
  'last-contacted': {
    label: 'Last contacted',
    compare: (a, b) =>
      timeOrFirst(b.lastContactedAt) - timeOrFirst(a.lastContactedAt) || byName(a, b),
  },
  'time-in-status': {
    label: 'Longest in status',
    compare: (a, b) => Date.parse(a.statusChangedAt) - Date.parse(b.statusChangedAt),
  },
  name: { label: 'Name A–Z', compare: byName },
};

export function sortContacts(contacts: Contact[], sort: ContactSort): Contact[] {
  return contacts.toSorted(contactSorts[sort].compare);
}

export function phoneHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

export function findContactByEmail(
  contacts: Contact[],
  email: string,
  exceptId: string | null,
): Contact | undefined {
  const target = normalizeText(email.trim());
  if (target === '') return undefined;
  return contacts.find(
    (contact) => contact.id !== exceptId && normalizeText(contact.email) === target,
  );
}
