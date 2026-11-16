import { describe, expect, it } from 'vitest';
import { createContactFormSchema, type ContactFormInput } from './contact-form-schema';

const schema = createContactFormSchema({ today: '2026-11-16', savedFollowUpAt: null });

const validContact: ContactFormInput = {
  name: 'Bilal Chaudhry',
  phone: '+92 300 1234567',
  email: '',
  preferredChannel: 'phone',
  matterType: 'Employment',
  source: 'Website form',
  referredBy: '',
  summary: 'Dismissed two weeks after reporting a safety issue.',
  status: 'lead',
  followUpDate: '2026-11-17',
  closeReason: '',
  attorneyId: '',
  conflictCheck: 'pending',
};

function issuesFor(input: ContactFormInput) {
  const result = schema.safeParse(input);
  if (result.success) return [];
  return result.error.issues.map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message,
  }));
}

describe('contact form schema', () => {
  it('accepts a valid minimal contact', () => {
    expect(schema.safeParse(validContact).success).toBe(true);
  });

  it('requires a name', () => {
    expect(issuesFor({ ...validContact, name: '' })).toContainEqual({
      field: 'name',
      message: "Enter the person's full name.",
    });
  });

  it('requires a phone number or an email', () => {
    expect(issuesFor({ ...validContact, phone: '', email: '' })).toContainEqual({
      field: 'phone',
      message: 'Add a phone number or email so the team can follow up.',
    });
  });

  it('rejects an invalid email and a phone number with too few digits', () => {
    const issues = issuesFor({ ...validContact, email: 'bilal@', phone: '300123' });

    expect(issues).toContainEqual({
      field: 'email',
      message: 'Enter an email like name@example.com.',
    });
    expect(issues).toContainEqual({
      field: 'phone',
      message: 'Include the area or mobile code, e.g. +92 300 1234567.',
    });
  });

  it('requires "Referred by" when the source is Referral', () => {
    expect(issuesFor({ ...validContact, source: 'Referral', referredBy: '' })).toContainEqual({
      field: 'referredBy',
      message: 'Who referred them? A name or firm is enough.',
    });
  });

  it('requires a close reason when the status is Closed', () => {
    expect(issuesFor({ ...validContact, status: 'closed', closeReason: '' })).toContainEqual({
      field: 'closeReason',
      message: 'Choose why this inquiry is closed.',
    });
  });
});
