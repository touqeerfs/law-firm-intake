import Link from 'next/link';
import { PenLine, Phone } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { buttonClasses } from '@/components/ui/button';
import { TimeInStatus } from '@/features/contacts/components/contact-fields';
import type { Contact, Status } from '@/features/contacts/contact-model';
import { phoneHref } from '@/features/contacts/contact-rules';
import { cx } from '@/lib/cx';
import { AttorneyAvatar, CardTags, ConflictMark } from './card-details';
import { CardMenu } from './card-menu';

type PipelineCardProps = {
  contact: Contact;
  isSaving: boolean;
  onMove: (contact: Contact, to: Status) => void;
};

const actionClasses = cx(
  buttonClasses({ variant: 'ghost', size: 'sm', iconOnly: true }),
  'max-desktop:hidden',
);

export function PipelineCard({ contact, isSaving, onMove }: PipelineCardProps) {
  return (
    <article
      aria-busy={isSaving}
      className={cx(
        'group relative rounded-md border bg-surface p-3 shadow-xs transition hover:-translate-y-px hover:border-border-strong hover:shadow-md',
        contact.conflictCheck === 'flagged' ? 'border-danger/40' : 'border-border',
      )}
    >
      {isSaving && (
        <span aria-hidden className="absolute inset-x-3 top-0 h-0.5 saving-shimmer rounded-full" />
      )}

      <div className="flex items-start gap-2.5">
        <Avatar name={contact.name} />
        <div className="min-w-0 flex-1 pr-6 desktop:pr-0">
          <Link
            href={`/contacts/${contact.id}`}
            className="block truncate font-semibold tracking-snug after:absolute after:inset-0 after:rounded-md"
          >
            {contact.name}
          </Link>
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

      <div className="absolute top-1.5 right-1.5 z-10 flex gap-0.5 rounded-sm desktop:top-2 desktop:right-2 desktop:border desktop:border-border desktop:bg-surface desktop:p-0.5 desktop:opacity-0 desktop:shadow-md desktop:transition-opacity desktop:group-focus-within:opacity-100 desktop:group-hover:opacity-100 desktop:has-aria-expanded:opacity-100">
        {contact.phone && (
          <a
            href={phoneHref(contact.phone)}
            aria-label={`Call ${contact.name}`}
            className={actionClasses}
          >
            <Phone className="size-3.5" aria-hidden />
          </a>
        )}
        <Link
          href={`/contacts/${contact.id}`}
          aria-label={`Log a note for ${contact.name}`}
          className={actionClasses}
        >
          <PenLine className="size-3.5" aria-hidden />
        </Link>
        <CardMenu contact={contact} onMove={onMove} />
      </div>
    </article>
  );
}
