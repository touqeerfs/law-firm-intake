import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Highlight } from '@/components/ui/highlight';
import { cx } from '@/lib/cx';
import { onPlainClick } from '@/lib/plain-click';
import type { Contact } from '../contact-model';
import { isNotContacted, type ContactSort } from '../contact-rules';
import {
  AttorneyName,
  ConflictFlag,
  ContactStatusPill,
  FollowUpTag,
  NoValue,
  NotContactedTag,
  RelativeTime,
  TimeInStatus,
} from './contact-fields';
import { SortableHeader } from './sortable-header';

type ContactsTableProps = {
  contacts: Contact[];
  query: string;
  sort: ContactSort;
  selectedId: string | null;
  onSortChange: (sort: ContactSort) => void;
  onOpen: (contactId: string) => void;
};

type ContactRowProps = {
  contact: Contact;
  query: string;
  isSelected: boolean;
  onOpen: (contactId: string) => void;
};

const headClasses =
  'h-9.5 border-b border-border bg-surface-2 px-3.5 text-left text-xs font-semibold whitespace-nowrap text-muted';
const cellClasses = 'h-14.5 truncate border-b border-border px-3.5 group-last:border-b-0';
const xwideOnly = 'hidden xwide:table-cell';

function ContactRow({ contact, query, isSelected, onOpen }: ContactRowProps) {
  return (
    <tr
      className={cx(
        'group relative transition-colors',
        isSelected ? 'bg-accent-soft' : 'hover:bg-surface-2',
      )}
    >
      <td className={cellClasses}>
        <div className="flex min-w-0 items-center gap-3">
          <Avatar name={contact.name} />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <Link
                href={`/contacts/${contact.id}`}
                onClick={onPlainClick(() => onOpen(contact.id))}
                className="truncate font-semibold after:absolute after:inset-0"
              >
                <Highlight text={contact.name} query={query} />
              </Link>
              {contact.conflictCheck === 'flagged' && <ConflictFlag />}
            </div>
            <span className="block truncate text-xs text-muted">
              <Highlight text={contact.id} query={query} /> ·{' '}
              {contact.email ? <Highlight text={contact.email} query={query} /> : contact.phone}
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

export function ContactsTable({
  contacts,
  query,
  sort,
  selectedId,
  onSortChange,
  onOpen,
}: ContactsTableProps) {
  return (
    <div className="hidden overflow-hidden rounded-xl border border-border bg-surface shadow-xs wide:block">
      <table className="w-full table-fixed border-separate border-spacing-0">
        <thead>
          <tr>
            <SortableHeader
              sort="name"
              direction="ascending"
              currentSort={sort}
              onSortChange={onSortChange}
              className={headClasses}
            >
              Name
            </SortableHeader>
            <th className={cx(headClasses, 'w-28')}>Status</th>
            <th className={cx(headClasses, 'w-36')}>Matter</th>
            <th className={cx(headClasses, xwideOnly, 'w-36')}>Attorney</th>
            <SortableHeader
              sort="follow-up"
              direction="ascending"
              currentSort={sort}
              onSortChange={onSortChange}
              className={cx(headClasses, 'w-32')}
            >
              Follow-up
            </SortableHeader>
            <SortableHeader
              sort="last-contacted"
              direction="descending"
              currentSort={sort}
              onSortChange={onSortChange}
              className={cx(headClasses, 'w-32')}
            >
              Last contact
            </SortableHeader>
            <th className={cx(headClasses, xwideOnly, 'w-28')}>Time in status</th>
            <th className={cx(headClasses, 'w-12')}>
              <span className="sr-only">Open</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <ContactRow
              key={contact.id}
              contact={contact}
              query={query}
              isSelected={contact.id === selectedId}
              onOpen={onOpen}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
