import Link from 'next/link';
import { Avatar } from '@/components/ui/avatar';
import { attorneys, type Contact } from '../contact-model';
import { isNotContacted } from '../contact-rules';
import {
  ConflictFlag,
  ContactStatusPill,
  FollowUpTag,
  NotContactedTag,
  TimeInStatus,
} from './contact-cells';

type ContactCardsProps = {
  contacts: Contact[];
};

export function ContactCards({ contacts }: ContactCardsProps) {
  return (
    <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface wide:hidden">
      {contacts.map((contact) => (
        <li key={contact.id}>
          <Link href={`/contacts/${contact.id}`} className="flex items-start gap-3 p-3.5">
            <Avatar name={contact.name} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="flex min-w-0 items-center gap-1.5">
                  <span className="truncate font-semibold">{contact.name}</span>
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
