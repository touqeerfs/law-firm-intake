import { useId } from 'react';
import Link from 'next/link';
import { ArrowDownUp, Inbox, Plus, WifiOff } from 'lucide-react';
import { buttonClasses } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { statusDotClasses } from '@/features/contacts/components/contact-fields';
import { statusDetails, type Contact, type Status } from '@/features/contacts/contact-model';
import { cx } from '@/lib/cx';
import { columnSortHints } from '../board-order';
import { ColumnPlaceholder, SkeletonCard } from './column-states';
import { ColumnSummary } from './column-summary';
import { PipelineCard } from './pipeline-card';

export type BoardState = 'loading' | 'error' | 'ready';

type BoardColumnProps = {
  status: Status;
  contacts: Contact[];
  state: BoardState;
  isCurrent: boolean;
  movingId: string | null;
  onMove: (contact: Contact, to: Status) => void;
};

const tintClasses: Record<Status, string> = {
  lead: 'from-lead/10',
  active: 'from-active/10',
  closed: 'from-closed/10',
};

const ringClasses: Record<Status, string> = {
  lead: 'ring-lead/22',
  active: 'ring-active/22',
  closed: 'ring-closed/22',
};

const emptyCopy: Record<Status, string> = {
  lead: 'No new inquiries. A quiet desk is a good time to work through follow-ups.',
  active: 'Nothing in progress. Move a lead here once a consultation is booked.',
  closed: 'No closed inquiries yet. Every close records a reason for reporting.',
};

export function BoardColumn({
  status,
  contacts,
  state,
  isCurrent,
  movingId,
  onMove,
}: BoardColumnProps) {
  const headingId = useId();

  return (
    <section
      aria-labelledby={headingId}
      className={cx(
        'min-h-75 flex-col rounded-lg border border-border bg-linear-to-b to-surface-2 to-40% p-1.5',
        tintClasses[status],
        isCurrent ? 'flex' : 'hidden desktop:flex',
      )}
    >
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

      {state === 'loading' ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: status === 'closed' ? 2 : 3 }, (_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : state === 'error' ? (
        <ColumnPlaceholder icon={WifiOff}>
          Cards will appear once the pipeline loads.
        </ColumnPlaceholder>
      ) : contacts.length === 0 ? (
        <ColumnPlaceholder icon={Inbox}>
          <strong className="mb-0.5 block font-semibold text-text-2">Empty</strong>
          {emptyCopy[status]}
        </ColumnPlaceholder>
      ) : (
        <ul className="flex flex-col gap-2">
          {contacts.map((contact) => (
            <li key={contact.id}>
              <PipelineCard contact={contact} isSaving={contact.id === movingId} onMove={onMove} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
