import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';

export type PillTone = 'lead' | 'active' | 'closed' | 'won' | 'lost';

type PillProps = {
  tone: PillTone;
  title?: string;
  children: ReactNode;
};

const toneClasses: Record<PillTone, { pill: string; dot: string }> = {
  lead: { pill: 'bg-lead-bg text-lead-fg', dot: 'bg-lead' },
  active: { pill: 'bg-active-bg text-active-fg', dot: 'bg-active' },
  closed: { pill: 'bg-closed-bg text-closed-fg', dot: 'bg-closed' },
  won: { pill: 'bg-won-bg text-won-fg', dot: 'bg-won' },
  lost: { pill: 'bg-lost-bg text-lost-fg', dot: 'bg-lost' },
};

export function Pill({ tone, title, children }: PillProps) {
  return (
    <span
      title={title}
      className={cx(
        'inline-flex h-5.5 items-center gap-1.5 rounded-full pr-2 pl-1.75 text-xs font-semibold whitespace-nowrap',
        toneClasses[tone].pill,
      )}
    >
      <span aria-hidden className={cx('size-1.75 shrink-0 rounded-full', toneClasses[tone].dot)} />
      {children}
    </span>
  );
}
