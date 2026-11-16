export const MINUTE_MS = 60_000;
export const HOUR_MS = 60 * MINUTE_MS;
export const DAY_MS = 24 * HOUR_MS;

const shortDate = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' });
const shortDateWithYear = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});
const weekday = new Intl.DateTimeFormat('en-GB', { weekday: 'short' });
const dayHeading = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
});
const time = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' });

export function startOfDay(date: Date): Date {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
}

export function calendarDaysBetween(from: Date, to: Date): number {
  // Rounding absorbs the 23- or 25-hour days around daylight-saving changes
  return Math.round((startOfDay(to).getTime() - startOfDay(from).getTime()) / DAY_MS);
}

export function formatShortDate(iso: string): string {
  const date = new Date(iso);
  const sameYear = date.getFullYear() === new Date().getFullYear();
  return (sameYear ? shortDate : shortDateWithYear).format(date);
}

export function formatWeekday(iso: string): string {
  return weekday.format(new Date(iso));
}

export function formatTime(iso: string): string {
  return time.format(new Date(iso));
}

export function formatDayHeading(iso: string): string {
  const days = calendarDaysBetween(new Date(iso), new Date());
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return dayHeading.format(new Date(iso));
}

export function formatRelative(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const elapsed = now.getTime() - date.getTime();

  if (elapsed < MINUTE_MS) return 'just now';
  if (elapsed < HOUR_MS) return `${Math.floor(elapsed / MINUTE_MS)}m ago`;

  const days = calendarDaysBetween(date, now);
  if (days === 0) return `${Math.floor(elapsed / HOUR_MS)}h ago`;
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days}d ago`;
  return formatShortDate(iso);
}
