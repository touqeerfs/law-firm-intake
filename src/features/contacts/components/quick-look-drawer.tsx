'use client';

import { useState, type KeyboardEvent } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { Button, buttonClasses } from '@/components/ui/button';
import { Drawer } from '@/components/ui/drawer';
import { ContactRecord } from './contact-record';
import { DiscardChangesDialog } from './discard-changes-dialog';

type QuickLookDrawerProps = {
  contactId: string;
  contactIds: string[];
  onShow: (contactId: string) => void;
  onClose: () => void;
};

function isTyping(target: EventTarget) {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  );
}

export function QuickLookDrawer({ contactId, contactIds, onShow, onClose }: QuickLookDrawerProps) {
  const [hasDraft, setHasDraft] = useState(false);
  const [pendingLeave, setPendingLeave] = useState<(() => void) | null>(null);

  const index = contactIds.indexOf(contactId);
  const previousId = index > 0 ? contactIds[index - 1] : undefined;
  const nextId = index >= 0 ? contactIds[index + 1] : undefined;

  function leave(action: () => void) {
    if (hasDraft) setPendingLeave(() => action);
    else action();
  }

  function show(id: string | undefined) {
    if (!id) return;
    leave(() => {
      setHasDraft(false);
      onShow(id);
    });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!(event.target instanceof Node) || !event.currentTarget.contains(event.target)) return;
    if (isTyping(event.target) || event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.key === 'j') show(nextId);
    else if (event.key === 'k') show(previousId);
    else return;
    event.preventDefault();
  }

  return (
    <>
      <Drawer
        title="Quick look"
        onClose={() => leave(onClose)}
        onKeyDown={handleKeyDown}
        actions={
          <>
            <Button
              variant="ghost"
              size="sm"
              iconOnly
              aria-label="Previous contact"
              title="Previous (K)"
              disabled={!previousId}
              onClick={() => show(previousId)}
            >
              <ChevronUp className="size-4" aria-hidden />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconOnly
              aria-label="Next contact"
              title="Next (J)"
              disabled={!nextId}
              onClick={() => show(nextId)}
            >
              <ChevronDown className="size-4" aria-hidden />
            </Button>
            <Link
              href={`/contacts/${contactId}`}
              className={buttonClasses({ variant: 'ghost', size: 'sm' })}
            >
              <ExternalLink className="size-3.5" aria-hidden />
              Open record
            </Link>
          </>
        }
      >
        <ContactRecord key={contactId} id={contactId} onDraftChange={setHasDraft} />
      </Drawer>
      {pendingLeave && (
        <DiscardChangesDialog
          onKeepEditing={() => setPendingLeave(null)}
          onDiscard={() => {
            setPendingLeave(null);
            pendingLeave();
          }}
        />
      )}
    </>
  );
}
