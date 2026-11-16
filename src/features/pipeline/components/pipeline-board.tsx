'use client';

import { useMemo, useState } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { PageHeader } from '@/components/layout/page-header';
import { CloseReasonDialog } from '@/features/contacts/components/close-reason-dialog';
import { ContactsLoadError } from '@/features/contacts/components/contacts-load-error';
import { statusSchema, type Contact, type Status } from '@/features/contacts/contact-model';
import { useContacts } from '@/features/contacts/use-contacts';
import { useDemoControls } from '@/features/contacts/use-demo-controls';
import { useStatusMove } from '@/features/contacts/use-status-move';
import { boardColumns } from '../board-order';
import { useBoardDrag } from '../use-board-drag';
import { BoardColumn, type BoardState } from './board-column';
import { BoardTabs } from './board-tabs';
import { CardOverlay } from './card-face';

type BoardSummaryProps = {
  contacts: Contact[];
};

function BoardSummary({ contacts }: BoardSummaryProps) {
  const open = contacts.filter((contact) => contact.status !== 'closed').length;
  return (
    <>
      <span aria-hidden className="size-1.75 rounded-full bg-won ring-3 ring-won/22" />
      {contacts.length} {contacts.length === 1 ? 'inquiry' : 'inquiries'} · {open} open
    </>
  );
}

export function PipelineBoard() {
  const { data: contacts, error, isPending, isFetching, refetch } = useContacts();
  const { changeData } = useDemoControls();
  const { requestMove, closing, confirmClose, cancelClose, movingId, lastMovedId } =
    useStatusMove();
  const [mobileStatus, setMobileStatus] = useState<Status>('lead');
  const columns = useMemo(() => boardColumns(contacts ?? []), [contacts]);
  const { dragged, contextProps } = useBoardDrag(contacts ?? [], requestMove);

  // A failed refetch keeps the last good list, so only a first load without data shows the error
  const state: BoardState = isPending ? 'loading' : contacts ? 'ready' : 'error';

  return (
    <>
      <PageHeader
        title="Pipeline"
        description={
          state === 'loading' ? (
            'Loading the intake pipeline…'
          ) : contacts ? (
            <BoardSummary contacts={contacts} />
          ) : (
            "Couldn't load the pipeline"
          )
        }
      />

      {state === 'error' && error && (
        <div className="mb-4">
          <ContactsLoadError
            title="Couldn't load the pipeline."
            error={error}
            isRetrying={isFetching}
            onRetry={() => refetch()}
            onReset={() => changeData('sample')}
          />
        </div>
      )}

      <BoardTabs
        counts={
          contacts
            ? {
                lead: columns.lead.length,
                active: columns.active.length,
                closed: columns.closed.length,
              }
            : null
        }
        currentStatus={mobileStatus}
        onStatusChange={setMobileStatus}
      />

      <DndContext {...contextProps}>
        <div
          aria-busy={state === 'loading'}
          className="grid items-start gap-3.5 desktop:grid-cols-3"
        >
          {statusSchema.options.map((status) => (
            <BoardColumn
              key={status}
              status={status}
              contacts={columns[status]}
              state={state}
              isCurrent={status === mobileStatus}
              movingId={movingId}
              lastMovedId={lastMovedId}
              dragged={dragged}
              onMove={requestMove}
            />
          ))}
        </div>
        <DragOverlay dropAnimation={null}>
          {dragged && <CardOverlay contact={dragged} />}
        </DragOverlay>
      </DndContext>

      {closing && (
        <CloseReasonDialog contact={closing} onConfirm={confirmClose} onCancel={cancelClose} />
      )}
    </>
  );
}
