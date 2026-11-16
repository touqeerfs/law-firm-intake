import type { ReactNode } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { TimeInStatus } from '@/features/contacts/components/contact-fields';
import type { Contact } from '@/features/contacts/contact-model';
import { cx } from '@/lib/cx';
import { AttorneyAvatar, CardTags, ConflictMark } from './card-details';

type CardFaceProps = {
  contact: Contact;
  name: ReactNode;
};

type CardOverlayProps = {
  contact: Contact;
};

export const nameClasses = 'block truncate font-semibold tracking-snug';

export function cardClasses(contact: Contact) {
  return cx(
    'relative rounded-md border bg-surface p-3',
    contact.conflictCheck === 'flagged' ? 'border-danger/40' : 'border-border',
  );
}

export function CardFace({ contact, name }: CardFaceProps) {
  return (
    <>
      <div className="flex items-start gap-2.5">
        <Avatar name={contact.name} />
        <div className="min-w-0 flex-1 pr-6 desktop:pr-0">
          {name}
          <p className="truncate text-xs text-muted">
            {contact.id} · {contact.matterType}
          </p>
        </div>
        <span className="hidden transition-opacity group-focus-within:opacity-0 group-hover:opacity-0 group-has-aria-expanded:opacity-0 desktop:block">
          <ConflictMark contact={contact} />
        </span>
      </div>

      <div className="mt-2.5 flex flex-wrap gap-1.5 empty:hidden">
        <CardTags contact={contact} />
      </div>

      <div className="mt-3 flex items-center gap-2">
        <TimeInStatus contact={contact} />
        <span className="truncate text-xs text-muted">{contact.source}</span>
        <span className="ml-auto">
          <AttorneyAvatar contact={contact} />
        </span>
      </div>
    </>
  );
}

export function CardOverlay({ contact }: CardOverlayProps) {
  return (
    <article
      aria-hidden
      className={cx(cardClasses(contact), 'cursor-grabbing shadow-lg motion-safe:rotate-2')}
    >
      <CardFace contact={contact} name={<span className={nameClasses}>{contact.name}</span>} />
    </article>
  );
}
