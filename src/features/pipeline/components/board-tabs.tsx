import { statusDotClasses } from '@/features/contacts/components/contact-fields';
import { statusDetails, statusSchema, type Status } from '@/features/contacts/contact-model';
import { cx } from '@/lib/cx';

type BoardTabsProps = {
  counts: Record<Status, number> | null;
  currentStatus: Status;
  onStatusChange: (status: Status) => void;
};

export function BoardTabs({ counts, currentStatus, onStatusChange }: BoardTabsProps) {
  return (
    <div
      role="group"
      aria-label="Status"
      className="mb-3 flex gap-0.5 rounded-md bg-surface-3 p-0.75 desktop:hidden"
    >
      {statusSchema.options.map((status) => (
        <button
          key={status}
          type="button"
          aria-pressed={status === currentStatus}
          onClick={() => onStatusChange(status)}
          className="inline-flex h-8.5 flex-1 items-center justify-center gap-1.5 rounded-sm text-sm font-semibold text-muted transition-colors hover:text-text aria-pressed:bg-surface aria-pressed:text-text aria-pressed:shadow-sm"
        >
          <span aria-hidden className={cx('size-1.75 rounded-full', statusDotClasses[status])} />
          {statusDetails[status].label}
          <span className="font-semibold text-muted tabular-nums">
            {counts ? counts[status] : '–'}
          </span>
        </button>
      ))}
    </div>
  );
}
