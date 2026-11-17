'use client';

import { Suspense, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { PageHeader } from '@/components/layout/page-header';
import { CloseReasonDialog } from '@/features/contacts/components/close-reason-dialog';
import { ContactsLoadError } from '@/features/contacts/components/contacts-load-error';
import { QuickLookDrawer } from '@/features/contacts/components/quick-look-drawer';
import { statusSchema, type Status } from '@/features/contacts/contact-model';
import { listViews } from '@/features/contacts/contact-rules';
import { useContacts } from '@/features/contacts/use-contacts';
import { useDemoControls } from '@/features/contacts/use-demo-controls';
import { useStatusMove } from '@/features/contacts/use-status-move';
import { boardFocusSchema, type BoardFocus } from '../board-focus';
import { boardColumns } from '../board-order';
import { useBoardDrag } from '../use-board-drag';
import { BoardColumn, type BoardState } from './board-column';
import { BoardSummary } from './board-summary';
import { BoardTabs } from './board-tabs';
import { CardOverlay } from './card-face';
import { FocusChip } from './focus-chip';
import { InsightsStrip } from './insights-strip';

type ContactsQuery = ReturnType<typeof useContacts>;

type BoardProps = {
  focus: BoardFocus | null;
  contactsQuery: ContactsQuery;
};

function Board({ focus, contactsQuery }: BoardProps) {
  const router = useRouter();
  const { data: contacts, error, isPending, isFetching, refetch } = contactsQuery;
  const { changeData } = useDemoControls();
  const { requestMove, closing, confirmClose, cancelClose, movingId, lastMovedId } =
    useStatusMove();
  const [mobileStatus, setMobileStatus] = useState<Status>('lead');
  const [quickLookId, setQuickLookId] = useState<string | null>(null);
  const columns = useMemo(() => {
    const all = contacts ?? [];
    return boardColumns(focus ? all.filter(listViews[focus].matches) : all);
  }, [contacts, focus]);
  const boardOrder = statusSchema.options.flatMap((status) =>
    columns[status].map((contact) => contact.id),
  );
  const { dragged, droppedId, contextProps } = useBoardDrag(contacts ?? [], requestMove);

  // A failed refetch keeps the last good list, so only a first load without data shows the error
  const state: BoardState = isPending ? 'loading' : contacts ? 'ready' : 'error';

  function changeFocus(next: BoardFocus | null) {
    router.replace(next ? `/pipeline?focus=${next}` : '/pipeline', { scroll: false });
  }

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

      {state !== 'error' && (
        <InsightsStrip contacts={contacts} focus={focus} onFocusChange={changeFocus} />
      )}

      {focus && (
        <div className="mb-3">
          <FocusChip focus={focus} onClear={() => changeFocus(null)} />
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
              isFiltered={focus !== null}
              movingId={movingId}
              landedId={lastMovedId}
              highlightedId={lastMovedId === droppedId ? lastMovedId : null}
              selectedId={quickLookId}
              dragged={dragged}
              onMove={requestMove}
              onOpen={setQuickLookId}
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

      {quickLookId && (
        <QuickLookDrawer
          contactId={quickLookId}
          contactIds={boardOrder}
          onShow={setQuickLookId}
          onClose={() => setQuickLookId(null)}
        />
      )}
    </>
  );
}

type FocusedBoardProps = {
  contactsQuery: ContactsQuery;
};

function FocusedBoard({ contactsQuery }: FocusedBoardProps) {
  const focus = boardFocusSchema.nullable().catch(null).parse(useSearchParams().get('focus'));
  return <Board focus={focus} contactsQuery={contactsQuery} />;
}

export function PipelineBoard() {
  // Read above the Suspense boundary, which can hydrate after the sidebar has already filled the cache
  const contactsQuery = useContacts();
  return (
    <Suspense fallback={<Board focus={null} contactsQuery={contactsQuery} />}>
      <FocusedBoard contactsQuery={contactsQuery} />
    </Suspense>
  );
}
