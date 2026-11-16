'use client';

import { useEffect, useState, type KeyboardEvent, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { PageHeader } from '@/components/layout/page-header';
import { Tag } from '@/components/ui/tag';
import { toDateInputValue } from '@/lib/dates';
import type { Contact, ContactInput } from '../contact-model';
import {
  contactFormValues,
  createContactFormSchema,
  newContactFormValues,
  type ContactFormInput,
} from '../contact-form-schema';
import { useContactMutations } from '../use-contact-mutations';
import { DiscardChangesDialog } from './discard-changes-dialog';
import { FormErrorSummary } from './form-error-summary';
import { FormFooter } from './form-footer';
import { IntakeSection } from './intake-section';
import { MatterSection } from './matter-section';
import { SaveErrorBanner } from './save-error-banner';
import { WhoSection } from './who-section';

type ContactFormProps = {
  contact?: Contact;
  initialName?: string;
};

export function ContactForm({ contact, initialName = '' }: ContactFormProps) {
  const router = useRouter();
  const { createContact, updateContact } = useContactMutations();
  const [isConfirmingCancel, setIsConfirmingCancel] = useState(false);
  const [resolver] = useState(() =>
    zodResolver(
      createContactFormSchema({
        today: toDateInputValue(new Date()),
        savedFollowUpAt: contact?.followUpAt ?? null,
      }),
    ),
  );
  const form = useForm<ContactFormInput, unknown, ContactInput>({
    resolver,
    mode: 'onTouched',
    shouldFocusError: false,
    defaultValues: contact ? contactFormValues(contact) : newContactFormValues(initialName),
  });

  const { isDirty } = form.formState;
  const saveMutation = contact ? updateContact : createContact;
  const isSaving = saveMutation.isPending || saveMutation.isSuccess;
  const cancelHref = contact ? `/contacts/${contact.id}` : '/contacts';

  useEffect(() => {
    if (!isDirty) return;
    function warnBeforeLeaving(event: BeforeUnloadEvent) {
      event.preventDefault();
    }
    window.addEventListener('beforeunload', warnBeforeLeaving);
    return () => window.removeEventListener('beforeunload', warnBeforeLeaving);
  }, [isDirty]);

  function openSavedContact(id: string, message: ReactNode) {
    router.push(`/contacts/${id}`);
    toast.success(message);
  }

  function save(input: ContactInput) {
    if (isSaving) return;
    if (contact) {
      updateContact.mutate(
        { id: contact.id, input },
        { onSuccess: () => openSavedContact(contact.id, 'Changes saved') },
      );
      return;
    }
    createContact.mutate(input, {
      onSuccess: ({ id }) =>
        openSavedContact(
          id,
          <span>
            Inquiry logged as <span className="font-mono">{id}</span>
          </span>,
        ),
    });
  }

  function submitOnShortcut(event: KeyboardEvent<HTMLFormElement>) {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      event.currentTarget.requestSubmit();
    }
  }

  function cancel() {
    if (isDirty) setIsConfirmingCancel(true);
    else router.push(cancelHref);
  }

  return (
    <div className="mx-auto max-w-narrow">
      <PageHeader
        title={contact ? `Edit ${contact.name}` : 'Log a new inquiry'}
        description={
          contact ? (
            <>
              <Tag tone="outline">
                <span className="font-mono">{contact.id}</span>
              </Tag>
              Changes are recorded on the activity timeline.
            </>
          ) : (
            "Capture the essentials while they're on the line. You can add detail later."
          )
        }
      />

      <FormProvider {...form}>
        <form
          noValidate
          onSubmit={form.handleSubmit(save)}
          onKeyDown={submitOnShortcut}
          className="pb-4 desktop:pb-0"
        >
          {saveMutation.error && <SaveErrorBanner error={saveMutation.error} />}
          <FormErrorSummary />
          <div className="flex flex-col gap-3.5">
            <WhoSection contactId={contact?.id ?? null} />
            <MatterSection />
            <IntakeSection />
          </div>
          <FormFooter
            isDirty={isDirty}
            isSaving={isSaving}
            submitLabel={contact ? 'Save changes' : 'Log inquiry'}
            onCancel={cancel}
          />
        </form>
      </FormProvider>

      {isConfirmingCancel && (
        <DiscardChangesDialog
          onKeepEditing={() => setIsConfirmingCancel(false)}
          onDiscard={() => router.push(cancelHref)}
        />
      )}
    </div>
  );
}
