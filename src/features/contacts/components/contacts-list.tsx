'use client';

import Link from 'next/link';
import { Inbox, Plus } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { buttonClasses } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import type { Contact } from '../contact-model';
import { isDue } from '../contact-rules';
import { useContacts } from '../use-contacts';
import { ContactCards } from './contact-cards';
import { ContactsListSkeleton } from './contacts-list-skeleton';
import { ContactsLoadError } from './contacts-load-error';
import { ContactsTable } from './contacts-table';

type ListSummaryProps = {
  contacts: Contact[];
};

function ListSummary({ contacts }: ListSummaryProps) {
  if (contacts.length === 0) return 'Nobody on the intake list yet';

  const due = contacts.filter(isDue).length;
  return (
    <>
      <span aria-hidden className="size-1.75 rounded-full bg-won ring-3 ring-won/22" />
      {contacts.length} {contacts.length === 1 ? 'person' : 'people'} on the intake list
      {due > 0 && (
        <>
          {' ·'}
          <span className="text-warn-fg">
            {due} {due === 1 ? 'follow-up' : 'follow-ups'} due
          </span>
        </>
      )}
    </>
  );
}

function NoContacts() {
  return (
    <EmptyState
      icon={Inbox}
      title="No inquiries logged yet"
      action={
        <Link href="/contacts/new" className={buttonClasses({ variant: 'primary' })}>
          <Plus className="size-3.75" aria-hidden />
          Log the first inquiry
        </Link>
      }
    >
      When someone calls, emails or walks in, log them here so the team can follow up the same day.
      Each inquiry gets a reference like INT-1042.
    </EmptyState>
  );
}

export function ContactsList() {
  const { data: contacts, error, isPending, isError, isFetching, refetch } = useContacts();

  return (
    <>
      <PageHeader
        title="Contacts"
        description={
          isPending ? (
            'Loading the intake list…'
          ) : isError ? (
            "Couldn't load the intake list"
          ) : (
            <ListSummary contacts={contacts} />
          )
        }
      />
      <div aria-busy={isPending}>
        {isPending ? (
          <ContactsListSkeleton />
        ) : isError ? (
          <ContactsLoadError error={error} isRetrying={isFetching} onRetry={() => refetch()} />
        ) : contacts.length === 0 ? (
          <NoContacts />
        ) : (
          <>
            <ContactsTable contacts={contacts} />
            <ContactCards contacts={contacts} />
          </>
        )}
      </div>
    </>
  );
}
