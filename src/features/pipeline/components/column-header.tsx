import Link from 'next/link';
import { ArrowDownUp, Plus } from 'lucide-react';
import { buttonClasses } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { statusDotClasses } from '@/features/contacts/components/contact-fields';
import { statusDetails, type Contact, type Status } from '@/features/contacts/contact-model';
import { cx } from '@/lib/cx';
import { columnSortHints } from '../board-order';
import type { BoardState } from './board-column';
import { ColumnSummary } from './column-summary';

type ColumnHeaderProps = {
  status: Status;
  contacts: Contact[];
  state: BoardState;
  headingId: string;
};

const ringClasses: Record<Status, string> = {
  lead: 'ring-lead/22',
  active: 'ring-active/22',
  closed: 'ring-closed/22',
};

export function ColumnHeader({ status, contacts, state, headingId }: ColumnHeaderProps) {
  return (
    <>
      <div className="flex items-center gap-2 px-2 pt-2 pb-2.5">
        <h2
          id={headingId}
          className="inline-flex h-6.5 items-center gap-1.75 rounded-sm bg-surface pr-2.5 pl-2 text-sm font-bold shadow-sm"
        >
          <span
            aria-hidden
            className={cx(
              'size-2 rounded-full ring-3',
              statusDotClasses[status],
              ringClasses[status],
            )}
          />
          {statusDetails[status].label}
        </h2>
        {state === 'ready' && (
          <span className="text-sm font-semibold text-muted tabular-nums">{contacts.length}</span>
        )}
        {status === 'lead' && (
          <Link
            href="/contacts/new"
            aria-label="Log a new inquiry"
            className={cx(
              buttonClasses({ variant: 'ghost', size: 'sm', iconOnly: true }),
              'ml-auto',
            )}
          >
            <Plus className="size-4" aria-hidden />
          </Link>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2.5 px-2 pb-2.5 text-xs text-muted">
        {state === 'loading' && <Skeleton className="h-2 w-2/5" />}
        {state === 'ready' && <ColumnSummary status={status} contacts={contacts} />}
        <span
          title="Cards are ordered automatically by urgency"
          className="ml-auto inline-flex items-center gap-1 text-faint"
        >
          <ArrowDownUp className="size-3" aria-hidden />
          {columnSortHints[status]}
        </span>
      </div>
    </>
  );
}
