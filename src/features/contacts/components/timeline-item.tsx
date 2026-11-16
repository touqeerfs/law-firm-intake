import {
  ArrowRight,
  CalendarDays,
  CircleAlert,
  Flag,
  Inbox,
  Mail,
  PenLine,
  Pencil,
  Phone,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import { cx } from '@/lib/cx';
import { formatShortDate, formatTime } from '@/lib/dates';
import type { Activity, ActivityType, Contact } from '../contact-model';
import { ActivityLine } from './activity-line';

export type PendingEntry = {
  activity: Activity;
  isFailed: boolean;
  onRetry: () => void;
  onDiscard: () => void;
};

const typeIcons: Record<ActivityType, LucideIcon> = {
  created: Inbox,
  call: Phone,
  email: Mail,
  note: PenLine,
  consultation: CalendarDays,
  conflict_check: ShieldCheck,
  status_change: ArrowRight,
  edit: Pencil,
};

const typeIconClasses: Record<ActivityType, string> = {
  created: 'bg-surface-3 text-text-2',
  call: 'bg-active-bg text-active-fg',
  email: 'bg-accent-soft text-accent-text',
  note: 'bg-lead-bg text-lead-fg',
  consultation: 'bg-surface-3 text-text-2',
  conflict_check: 'bg-won-bg text-won-fg',
  status_change: 'bg-text text-canvas',
  edit: 'bg-surface-3 text-text-2',
};

type TimelineItemProps = {
  activity: Activity;
  contact: Contact;
  pending: PendingEntry | null;
  isLast: boolean;
};

export function TimelineItem({ activity, contact, pending, isLast }: TimelineItemProps) {
  const isFlag = activity.type === 'conflict_check' && activity.flagged;
  const Icon = isFlag ? Flag : typeIcons[activity.type];
  const isSaving = pending !== null && !pending.isFailed;

  return (
    <li className={cx('relative flex gap-3 pt-1.5 pb-2.5', isSaving && 'opacity-55')}>
      {!isLast && (
        <span aria-hidden className="absolute top-9 -bottom-1.5 left-3.5 w-px bg-border" />
      )}
      <span
        className={cx(
          'relative grid size-7.5 shrink-0 place-items-center rounded-md',
          isFlag ? 'bg-danger-bg text-danger-fg' : typeIconClasses[activity.type],
        )}
      >
        <Icon className="size-3.5" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2 pt-1.25">
          <p className="flex min-w-0 flex-1 flex-wrap items-center gap-x-1.5 gap-y-1 text-text-2">
            <ActivityLine activity={activity} contact={contact} />
          </p>
          <time
            dateTime={activity.at}
            title={`${formatShortDate(activity.at)}, ${formatTime(activity.at)}`}
            className="shrink-0 text-xs text-faint tabular-nums"
          >
            {isSaving ? 'Saving…' : formatTime(activity.at)}
          </time>
        </div>
        {activity.body && (
          <p
            className={cx(
              'mt-1.5 rounded-md border px-3 py-2.5 leading-5 whitespace-pre-wrap',
              pending?.isFailed
                ? 'border-danger/25 bg-danger-bg'
                : 'border-border bg-surface-2 text-text',
            )}
          >
            {activity.body}
          </p>
        )}
        {pending?.isFailed && (
          <div role="alert" className="mt-1.5 flex items-center gap-2.5 text-sm text-danger-fg">
            <CircleAlert className="size-3.25" aria-hidden />
            Not saved.
            <button type="button" onClick={pending.onRetry} className="font-semibold underline">
              Retry
            </button>
            <button type="button" onClick={pending.onDiscard} className="font-semibold underline">
              Discard
            </button>
          </div>
        )}
      </div>
    </li>
  );
}
