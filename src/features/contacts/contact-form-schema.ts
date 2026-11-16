import { z } from 'zod';
import { addDays, fromDateInputValue, toDateInputValue } from '@/lib/dates';
import { digitsOnly } from '@/lib/text';
import {
  attorneyIdSchema,
  closeReasonSchema,
  conflictCheckSchema,
  matterTypeSchema,
  preferredChannelSchema,
  sourceSchema,
  statusSchema,
  type Contact,
  type ContactInput,
} from './contact-model';

export const SUMMARY_MAX_LENGTH = 600;
export const PHONE_OR_EMAIL_MESSAGE = 'Add a phone number or email so the team can follow up.';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type ContactFormContext = {
  today: string;
  savedFollowUpAt: string | null;
};

function isPhoneLength(phone: string): boolean {
  const digits = digitsOnly(phone).length;
  return digits >= 10 && digits <= 15;
}

function dateInputValueOf(iso: string | null): string {
  return iso ? toDateInputValue(new Date(iso)) : '';
}

export function createContactFormSchema({ today, savedFollowUpAt }: ContactFormContext) {
  const savedFollowUpDate = dateInputValueOf(savedFollowUpAt);

  function followUpAtFrom(followUpDate: string): string | null {
    if (followUpDate === '') return null;
    if (followUpDate === savedFollowUpDate) return savedFollowUpAt;
    return fromDateInputValue(followUpDate);
  }

  return z
    .object({
      name: z
        .string()
        .trim()
        .min(1, "Enter the person's full name.")
        .min(2, 'That name looks too short.'),
      phone: z
        .string()
        .trim()
        .refine(
          (phone) => phone === '' || isPhoneLength(phone),
          'Include the area or mobile code, e.g. +92 300 1234567.',
        ),
      email: z
        .string()
        .trim()
        .refine(
          (email) => email === '' || EMAIL_PATTERN.test(email),
          'Enter an email like name@example.com.',
        ),
      preferredChannel: preferredChannelSchema,
      matterType: z
        .string()
        .pipe(z.enum(matterTypeSchema.options, { error: 'Choose the type of matter.' })),
      source: z
        .string()
        .pipe(z.enum(sourceSchema.options, { error: 'Choose how they found the firm.' })),
      referredBy: z.string().trim(),
      summary: z
        .string()
        .trim()
        .min(1, 'Briefly describe what they need help with.')
        .min(15, 'Add a little more detail, at least one full sentence.')
        .max(SUMMARY_MAX_LENGTH, `Keep the summary under ${SUMMARY_MAX_LENGTH} characters.`),
      status: statusSchema,
      followUpDate: z.string(),
      closeReason: closeReasonSchema.or(z.literal('')),
      attorneyId: attorneyIdSchema.or(z.literal('')),
      conflictCheck: conflictCheckSchema,
    })
    .superRefine(
      (values, context) => {
        if (values.phone === '' && values.email === '') {
          context.addIssue({ code: 'custom', path: ['phone'], message: PHONE_OR_EMAIL_MESSAGE });
        }
        if (values.source === 'Referral' && values.referredBy === '') {
          context.addIssue({
            code: 'custom',
            path: ['referredBy'],
            message: 'Who referred them? A name or firm is enough.',
          });
        }
        if (values.status === 'closed' && values.closeReason === '') {
          context.addIssue({
            code: 'custom',
            path: ['closeReason'],
            message: 'Choose why this inquiry is closed.',
          });
        }
        // An existing overdue date must not block unrelated edits; only a newly chosen past date is an error
        const isNewPastDate =
          values.followUpDate !== '' &&
          values.followUpDate !== savedFollowUpDate &&
          values.followUpDate < today;
        if (values.status !== 'closed' && isNewPastDate) {
          context.addIssue({
            code: 'custom',
            path: ['followUpDate'],
            message: "Follow-up date can't be in the past.",
          });
        }
      },
      // By default Zod skips this while a choice is still empty; an empty submit should list every error
      { when: () => true },
    )
    .transform(({ followUpDate, ...values }): ContactInput => {
      const isClosed = values.status === 'closed';
      return {
        ...values,
        referredBy: values.source === 'Referral' ? values.referredBy : '',
        attorneyId: values.attorneyId || null,
        closeReason: isClosed ? values.closeReason || null : null,
        followUpAt: isClosed ? null : followUpAtFrom(followUpDate),
      };
    });
}

export type ContactFormInput = z.input<ReturnType<typeof createContactFormSchema>>;
export type ContactFormField = keyof ContactFormInput;

export function newContactFormValues(name: string): ContactFormInput {
  return {
    name,
    phone: '',
    email: '',
    preferredChannel: 'phone',
    matterType: '',
    source: '',
    referredBy: '',
    summary: '',
    status: 'lead',
    followUpDate: toDateInputValue(addDays(new Date(), 1)),
    closeReason: '',
    attorneyId: '',
    conflictCheck: 'pending',
  };
}

export function contactFormValues(contact: Contact): ContactFormInput {
  return {
    name: contact.name,
    phone: contact.phone,
    email: contact.email,
    preferredChannel: contact.preferredChannel,
    matterType: contact.matterType,
    source: contact.source,
    referredBy: contact.referredBy,
    summary: contact.summary,
    status: contact.status,
    followUpDate: dateInputValueOf(contact.followUpAt),
    closeReason: contact.closeReason ?? '',
    attorneyId: contact.attorneyId ?? '',
    conflictCheck: contact.conflictCheck,
  };
}
