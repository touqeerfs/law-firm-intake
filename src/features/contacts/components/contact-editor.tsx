'use client';

import Link from 'next/link';
import { FolderSearch } from 'lucide-react';
import { buttonClasses } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { RepositoryError } from '../repository-error';
import { useContact } from '../use-contacts';
import { useDemoControls } from '../use-demo-controls';
import { ContactForm } from './contact-form';
import { ContactFormSkeleton } from './contact-form-skeleton';
import { ContactsLoadError } from './contacts-load-error';

type ContactEditorProps = {
  id: string;
};

export function ContactEditor({ id }: ContactEditorProps) {
  const { data, error, isPending, isError, isFetching, refetch } = useContact(id);
  const { changeData } = useDemoControls();

  if (isPending) return <ContactFormSkeleton />;

  if (isError && !data) {
    if (error instanceof RepositoryError && error.code === 'not_found') {
      return (
        <EmptyState
          icon={FolderSearch}
          title={`We couldn't find ${id}`}
          titleAs="h1"
          action={
            <Link href="/contacts" className={buttonClasses({ variant: 'primary' })}>
              Back to contacts
            </Link>
          }
        >
          It may have been removed, so there&apos;s nothing to edit.
        </EmptyState>
      );
    }
    return (
      <ContactsLoadError
        title="Couldn't load this contact for editing."
        error={error}
        isRetrying={isFetching}
        onRetry={() => refetch()}
        onReset={() => changeData('sample')}
      />
    );
  }

  return <ContactForm contact={data.contact} />;
}
