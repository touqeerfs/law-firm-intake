import { useId } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Inbox, WifiOff } from 'lucide-react';
import type { Contact, Status } from '@/features/contacts/contact-model';
import { cx } from '@/lib/cx';
import { landingIndex } from '../board-order';
import { ColumnHeader } from './column-header';
import { ColumnPlaceholder, DropSlot, SkeletonCard } from './column-states';
import { PipelineCard } from './pipeline-card';

export type BoardState = 'loading' | 'error' | 'ready';

type BoardColumnProps = {
  status: Status;
  contacts: Contact[];
  state: BoardState;
  isCurrent: boolean;
  movingId: string | null;
  landedId: string | null;
  highlightedId: string | null;
  dragged: Contact | null;
  onMove: (contact: Contact, to: Status) => void;
};

const tintClasses: Record<Status, string> = {
  lead: 'from-lead/10',
  active: 'from-active/10',
  closed: 'from-closed/10',
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
  landedId,
  highlightedId,
  dragged,
  onMove,
}: BoardColumnProps) {
  const headingId = useId();
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const slotIndex =
    isOver && dragged && dragged.status !== status
      ? landingIndex(contacts, dragged, status, new Date())
      : null;

  const cards = contacts.map((contact) => (
    <li key={contact.id}>
      <PipelineCard
        contact={contact}
        isSaving={contact.id === movingId}
        isLanded={contact.id === landedId}
        isHighlighted={contact.id === highlightedId}
        onMove={onMove}
      />
    </li>
  ));

  return (
    <section
      ref={setNodeRef}
      aria-labelledby={headingId}
      className={cx(
        'min-h-75 flex-col rounded-lg border bg-linear-to-b to-surface-2 to-40% p-1.5 transition-shadow',
        tintClasses[status],
        slotIndex === null ? 'border-border' : 'border-accent/45 ring-3 ring-accent/14',
        isCurrent ? 'flex' : 'hidden desktop:flex',
      )}
    >
      <ColumnHeader status={status} contacts={contacts} state={state} headingId={headingId} />

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
      ) : contacts.length === 0 && slotIndex === null ? (
        <ColumnPlaceholder icon={Inbox}>
          <strong className="mb-0.5 block font-semibold text-text-2">Empty</strong>
          {emptyCopy[status]}
        </ColumnPlaceholder>
      ) : (
        <ul className="flex flex-col gap-2">
          {slotIndex === null
            ? cards
            : cards.toSpliced(
                slotIndex,
                0,
                <li key="drop-slot" aria-hidden>
                  <DropSlot status={status} />
                </li>,
              )}
        </ul>
      )}
    </section>
  );
}
