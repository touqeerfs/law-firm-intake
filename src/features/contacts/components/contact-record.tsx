'use client';

import Link from 'next/link';
import { FolderSearch } from 'lucide-react';
import { buttonClasses } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { RepositoryError } from '../repository-error';
import { useContact } from '../use-contacts';
import { useDemoControls } from '../use-demo-controls';
import { useStatusMove } from '../use-status-move';
import { ActivitySection } from './activity-section';
import { CloseReasonDialog } from './close-reason-dialog';
import { ContactBanners } from './contact-banners';
import { ContactDetailsCard } from './contact-details-card';
import { ContactHeader } from './contact-header';
import { ContactRecordSkeleton } from './contact-record-skeleton';
import { ContactsLoadError } from './contacts-load-error';
import { MatterCard } from './matter-card';
import { StatusStepper } from './status-stepper';

type ContactRecordProps = {
  id: string;
};

function ContactNotFound({ id }: ContactRecordProps) {
  return (
    <EmptyState
      icon={FolderSearch}
      title={`We couldn't find ${id}`}
      action={
        <Link href="/contacts" className={buttonClasses({ variant: 'primary' })}>
          Back to contacts
        </Link>
      }
    >
      This record may have been removed, or the link is incomplete. Search the intake list by name
      or phone number instead.
    </EmptyState>
  );
}

export function ContactRecord({ id }: ContactRecordProps) {
  const { data, error, isPending, isError, isFetching, refetch } = useContact(id);
  const { changeData } = useDemoControls();
  const { requestMove, closing, confirmClose, cancelClose } = useStatusMove();

  if (isPending) return <ContactRecordSkeleton />;

  if (isError && !data) {
    if (error instanceof RepositoryError && error.code === 'not_found') {
      return <ContactNotFound id={id} />;
    }
    return (
      <ContactsLoadError
        title="Couldn't load this contact."
        error={error}
        isRetrying={isFetching}
        onRetry={() => refetch()}
        onReset={() => changeData('sample')}
      />
    );
  }

  const { contact, activities } = data;

  return (
    <>
      <ContactHeader contact={contact} />
      <StatusStepper contact={contact} onMove={(to) => requestMove(contact, to)} />
      <ContactBanners contact={contact} />
      <div className="flex flex-col gap-4.5 wide:flex-row wide:items-start">
        <div className="flex flex-col gap-3.5 wide:w-95 wide:shrink-0">
          <MatterCard contact={contact} />
          <ContactDetailsCard contact={contact} />
        </div>
        <ActivitySection contact={contact} activities={activities} />
      </div>
      {closing && (
        <CloseReasonDialog contact={closing} onConfirm={confirmClose} onCancel={cancelClose} />
      )}
    </>
  );
}
