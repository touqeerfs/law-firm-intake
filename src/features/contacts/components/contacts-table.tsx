import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { cx } from '@/lib/cx';
import type { Contact } from '../contact-model';
import { isNotContacted } from '../contact-rules';
import {
  AttorneyName,
  ConflictFlag,
  ContactStatusPill,
  FollowUpTag,
  NoValue,
  NotContactedTag,
  RelativeTime,
  TimeInStatus,
} from './contact-cells';

type ContactsTableProps = {
  contacts: Contact[];
};

type ContactRowProps = {
  contact: Contact;
};

const headClasses =
  'h-9.5 border-b border-border bg-surface-2 px-3.5 text-left text-xs font-semibold whitespace-nowrap text-muted';
const cellClasses = 'h-14.5 truncate border-b border-border px-3.5 group-last:border-b-0';
const xwideOnly = 'hidden xwide:table-cell';

function ContactRow({ contact }: ContactRowProps) {
  return (
    <tr className="group relative transition-colors hover:bg-surface-2">
      <td className={cellClasses}>
        <div className="flex min-w-0 items-center gap-3">
          <Avatar name={contact.name} />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <Link
                href={`/contacts/${contact.id}`}
                className="truncate font-semibold after:absolute after:inset-0"
              >
                {contact.name}
              </Link>
              {contact.conflictCheck === 'flagged' && <ConflictFlag />}
            </div>
            <span className="block truncate text-xs text-muted">
              {contact.id} · {contact.email || contact.phone}
            </span>
          </div>
        </div>
      </td>
      <td className={cellClasses}>
        <ContactStatusPill contact={contact} />
      </td>
      <td className={cx(cellClasses, 'text-muted')}>{contact.matterType}</td>
      <td className={cx(cellClasses, xwideOnly)}>
        <AttorneyName attorneyId={contact.attorneyId} />
      </td>
      <td className={cellClasses}>
        <FollowUpTag contact={contact} fallback={<NoValue />} />
      </td>
      <td className={cx(cellClasses, 'text-muted')}>
        {contact.lastContactedAt ? (
          <RelativeTime iso={contact.lastContactedAt} />
        ) : isNotContacted(contact) ? (
          <NotContactedTag />
        ) : (
          <NoValue />
        )}
      </td>
      <td className={cx(cellClasses, xwideOnly)}>
        <TimeInStatus contact={contact} />
      </td>
      <td className={cx(cellClasses, 'text-faint group-hover:text-text-2')}>
        <ChevronRight className="size-3.75" aria-hidden />
      </td>
    </tr>
  );
}

export function ContactsTable({ contacts }: ContactsTableProps) {
  return (
    <div className="hidden overflow-hidden rounded-xl border border-border bg-surface shadow-xs wide:block">
      <table className="w-full table-fixed border-separate border-spacing-0">
        <thead>
          <tr>
            <th className={headClasses}>Name</th>
            <th className={cx(headClasses, 'w-28')}>Status</th>
            <th className={cx(headClasses, 'w-36')}>Matter</th>
            <th className={cx(headClasses, xwideOnly, 'w-36')}>Attorney</th>
            <th className={cx(headClasses, 'w-32')}>Follow-up</th>
            <th className={cx(headClasses, 'w-32')}>Last contact</th>
            <th className={cx(headClasses, xwideOnly, 'w-28')}>Time in status</th>
            <th className={cx(headClasses, 'w-12')}>
              <span className="sr-only">Open</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <ContactRow key={contact.id} contact={contact} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
