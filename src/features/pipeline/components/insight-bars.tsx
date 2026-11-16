import type { Outcome } from '@/features/contacts/contact-model';
import { cx } from '@/lib/cx';

type TargetBarProps = {
  percent: number;
};

type OutcomeBarProps = {
  outcomes: Record<Outcome, number>;
};

const trackClasses = 'flex h-1.5 max-w-35 flex-1 overflow-hidden rounded-full bg-surface-3';

const outcomeOrder: Outcome[] = ['won', 'lost', 'declined'];

const outcomeClasses: Record<Outcome, string> = {
  won: 'bg-won',
  lost: 'bg-lost',
  declined: 'bg-closed',
};

export function TargetBar({ percent }: TargetBarProps) {
  return (
    <span aria-hidden className={trackClasses}>
      <span className="rounded-full bg-active" style={{ width: `${percent}%` }} />
    </span>
  );
}

export function OutcomeBar({ outcomes }: OutcomeBarProps) {
  return (
    <span aria-hidden className={cx(trackClasses, 'gap-0.5')}>
      {outcomeOrder.map(
        (outcome) =>
          outcomes[outcome] > 0 && (
            <span
              key={outcome}
              className={cx('rounded-2xs', outcomeClasses[outcome])}
              style={{ flexGrow: outcomes[outcome] }}
            />
          ),
      )}
    </span>
  );
}
