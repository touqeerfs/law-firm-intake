import { calendarDaysBetween, DAY_MS, formatShortDate, formatWeekday } from '@/lib/dates';
import type { Contact } from './contact-model';

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
