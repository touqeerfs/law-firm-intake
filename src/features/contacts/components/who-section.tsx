import Link from 'next/link';
import { useFormContext, useWatch } from 'react-hook-form';
import { Mail, MessageCircle, Phone, User, type LucideIcon } from 'lucide-react';
import { Choice, ChoiceGroup } from '@/components/ui/choice';
import { Field, FieldMessage, fieldMessageId } from '@/components/ui/field';
import { FormCard } from '@/components/ui/form-card';
import { TextInput } from '@/components/ui/input';
import {
  preferredChannelLabels,
  preferredChannelSchema,
  type PreferredChannel,
} from '../contact-model';
import { PHONE_OR_EMAIL_MESSAGE, type ContactFormInput } from '../contact-form-schema';
import { findContactByEmail } from '../contact-rules';
import { useContactFieldProps } from '../use-contact-field-props';
import { useContacts } from '../use-contacts';

type WhoSectionProps = {
  contactId: string | null;
};

const channelIcons: Record<PreferredChannel, LucideIcon> = {
  phone: Phone,
  whatsapp: MessageCircle,
  email: Mail,
};

const PHONE_OR_EMAIL_ID = 'phone-or-email-message';

export function WhoSection({ contactId }: WhoSectionProps) {
  const {
    register,
    trigger,
    formState: { errors },
  } = useFormContext<ContactFormInput>();
  const fieldProps = useContactFieldProps();
  const email = useWatch<ContactFormInput, 'email'>({ name: 'email' });
  const { data: contacts = [] } = useContacts();

  const needsPhoneOrEmail = errors.phone?.message === PHONE_OR_EMAIL_MESSAGE;
  const duplicate = errors.email ? undefined : findContactByEmail(contacts, email, contactId);

  return (
    <FormCard
      icon={User}
      title="Who's getting in touch"
      description="The person and the best way to reach them."
    >
      <Field htmlFor="name" label="Full name" required wide error={errors.name?.message}>
        <TextInput {...fieldProps('name')} autoComplete="off" placeholder="e.g. Ayesha Siddiqui" />
      </Field>

      <Field
        htmlFor="phone"
        label="Phone"
        error={needsPhoneOrEmail ? undefined : errors.phone?.message}
      >
        <TextInput
          {...fieldProps('phone')}
          type="tel"
          inputMode="tel"
          placeholder="+92 300 1234567"
          aria-invalid={errors.phone ? true : undefined}
          aria-describedby={`${fieldMessageId('phone')} ${PHONE_OR_EMAIL_ID}`}
        />
      </Field>

      <Field
        htmlFor="email"
        label="Email"
        error={errors.email?.message}
        hintTone="warn"
        hint={
          duplicate && (
            <>
              {duplicate.name} ({duplicate.id}) already uses this email.{' '}
              <Link href={`/contacts/${duplicate.id}`} className="underline underline-offset-2">
                Open record
              </Link>
            </>
          )
        }
      >
        <TextInput
          {...fieldProps('email', () => needsPhoneOrEmail && trigger('phone'))}
          type="email"
          inputMode="email"
          placeholder="name@example.com"
          aria-invalid={errors.email || needsPhoneOrEmail ? true : undefined}
          aria-describedby={`${fieldMessageId('email')} ${PHONE_OR_EMAIL_ID}`}
        />
      </Field>

      <div className="-mt-2 desktop:col-span-2">
        <FieldMessage id={PHONE_OR_EMAIL_ID} tone={needsPhoneOrEmail ? 'error' : 'help'}>
          {needsPhoneOrEmail
            ? PHONE_OR_EMAIL_MESSAGE
            : 'At least one of phone or email is required.'}
        </FieldMessage>
      </div>

      <ChoiceGroup legend="Prefers to be contacted by">
        {preferredChannelSchema.options.map((channel) => {
          const Icon = channelIcons[channel];
          return (
            <Choice key={channel} value={channel} {...register('preferredChannel')}>
              <Icon className="size-3.75" aria-hidden />
              {preferredChannelLabels[channel]}
            </Choice>
          );
        })}
      </ChoiceGroup>
    </FormCard>
  );
}
