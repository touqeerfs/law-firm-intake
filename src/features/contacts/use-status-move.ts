import { useState } from 'react';
import type { CloseReason, Contact, Status } from './contact-model';
import { useContactMutations } from './use-contact-mutations';

export function useStatusMove() {
  const { moveContact } = useContactMutations();
  const [closing, setClosing] = useState<Contact | null>(null);

  function requestMove(contact: Contact, to: Status) {
    if (to === contact.status) return;
    if (to === 'closed') setClosing(contact);
    else moveContact.mutate({ contact, move: { to } });
  }

  function confirmClose(closeReason: CloseReason, note: string) {
    if (closing) {
      moveContact.mutate({ contact: closing, move: { to: 'closed', closeReason, note } });
    }
    setClosing(null);
  }

  return {
    requestMove,
    closing,
    confirmClose,
    cancelClose: () => setClosing(null),
    movingId: moveContact.isPending ? moveContact.variables.contact.id : null,
    lastMovedId: moveContact.variables?.contact.id ?? null,
  };
}
