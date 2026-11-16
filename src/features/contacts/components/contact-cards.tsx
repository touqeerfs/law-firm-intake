import Link from 'next/link';
import { Avatar } from '@/components/ui/avatar';
import { Highlight } from '@/components/ui/highlight';
import { cx } from '@/lib/cx';
import { onPlainClick } from '@/lib/plain-click';
import { attorneys, type Contact } from '../contact-model';
import { isNotContacted } from '../contact-rules';
import {
  ConflictFlag,
  ContactStatusPill,
  FollowUpTag,
  NotContactedTag,
  TimeInStatus,
} from './contact-fields';

type ContactCardsProps = {
  contacts: Contact[];
  query: string;
  selectedId: string | null;
  onOpen: (contactId: string) => void;
};

export function ContactCards({ contacts, query, selectedId, onOpen }: ContactCardsProps) {
  return (
    <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface wide:hidden">
      {contacts.map((contact) => (
        <li key={contact.id}>
          <Link
            href={`/contacts/${contact.id}`}
            onClick={onPlainClick(() => onOpen(contact.id))}
            className={cx(
              'flex items-start gap-3 p-3.5',
              contact.id === selectedId && 'bg-accent-soft',
            )}
          >
            <Avatar name={contact.name} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="flex min-w-0 items-center gap-1.5">
                  <span className="truncate font-semibold">
                    <Highlight text={contact.name} query={query} />
                  </span>
                  {contact.conflictCheck === 'flagged' && <ConflictFlag />}
                </span>
                <ContactStatusPill contact={contact} />
              </div>
              <p className="mt-0.5 truncate text-sm text-muted">
                {contact.matterType} ·{' '}
                {contact.attorneyId ? attorneys[contact.attorneyId].shortName : 'Unassigned'}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <FollowUpTag contact={contact} />
                {isNotContacted(contact) && <NotContactedTag />}
                <TimeInStatus contact={contact} />
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
