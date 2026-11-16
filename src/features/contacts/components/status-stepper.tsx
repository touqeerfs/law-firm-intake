import { Check } from 'lucide-react';
import { cx } from '@/lib/cx';
import { statusDetails, statusSchema, type Contact, type Status } from '../contact-model';
import { timeInStatus } from '../contact-rules';

type StatusStepperProps = {
  contact: Contact;
  onMove: (to: Status) => void;
};

const dotClasses: Record<Status, string> = {
  lead: 'bg-lead ring-lead/25',
  active: 'bg-active ring-active/25',
  closed: 'bg-closed ring-closed/25',
};

export function StatusStepper({ contact, onMove }: StatusStepperProps) {
  const statuses = statusSchema.options;
  const currentIndex = statuses.indexOf(contact.status);
  const { days } = timeInStatus(contact);

  return (
    <ol
      aria-label="Status"
      className="mb-4.5 grid grid-cols-3 gap-1 rounded-md bg-surface-3 p-1 text-sm font-semibold"
    >
      {statuses.map((status, index) => {
        const isDone = index < currentIndex;
        const isCurrent = index === currentIndex;

        const classes = cx(
          'flex h-8.5 w-full items-center justify-center gap-1.75 rounded-sm transition-colors',
          isCurrent && 'bg-surface text-text shadow-sm',
          isDone && 'text-text-2',
          !isCurrent && !isDone && 'text-muted',
          !isCurrent && 'cursor-pointer hover:bg-surface/60 hover:text-text',
        );
        const content = (
          <>
            {isDone ? (
              <Check className="size-3.25" aria-hidden />
            ) : (
              <span
                aria-hidden
                className={cx(
                  'size-1.75 rounded-full',
                  isCurrent ? cx(dotClasses[status], 'ring-3') : 'bg-border-strong',
                )}
              />
            )}
            {statusDetails[status].label}
            {isCurrent && (
              <span className="font-medium text-muted">· {days === 0 ? 'today' : `${days}d`}</span>
            )}
          </>
        );

        return (
          <li key={status} aria-current={isCurrent ? 'step' : undefined}>
            {isCurrent ? (
              <span className={classes}>{content}</span>
            ) : (
              <button
                type="button"
                aria-label={`Move to ${statusDetails[status].label}`}
                onClick={() => onMove(status)}
                className={classes}
              >
                {content}
              </button>
            )}
          </li>
        );
      })}
    </ol>
  );
}
