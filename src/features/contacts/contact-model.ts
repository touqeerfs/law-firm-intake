import { z } from 'zod';

export const COORDINATOR = 'Hira Malik';

export const statusSchema = z.enum(['lead', 'active', 'closed']);
export type Status = z.infer<typeof statusSchema>;

export const statusDetails: Record<Status, { label: string; hint: string }> = {
  lead: { label: 'Lead', hint: 'New inquiries awaiting a consultation' },
  active: { label: 'Active', hint: 'Consultation booked or engagement in progress' },
  closed: { label: 'Closed', hint: 'Retained, declined or lost, always with a reason' },
};

export const closeReasonSchema = z.enum([
  'retained',
  'hired_other',
  'unresponsive',
  'conflict',
  'outside',
  'limitations',
  'referred',
]);
export type CloseReason = z.infer<typeof closeReasonSchema>;

export type Outcome = 'won' | 'lost' | 'declined';

type CloseReasonDetails = {
  label: string;
  shortLabel: string;
  hint: string;
  outcome: Outcome;
};

export const closeReasons: Record<CloseReason, CloseReasonDetails> = {
  retained: {
    label: 'Retained',
    shortLabel: 'Retained',
    hint: 'Engagement letter signed',
    outcome: 'won',
  },
  hired_other: {
    label: 'Hired another firm',
    shortLabel: 'Lost',
    hint: 'Chose a different lawyer',
    outcome: 'lost',
  },
  unresponsive: {
    label: 'Stopped responding',
    shortLabel: 'Lost',
    hint: 'No reply after follow-ups',
    outcome: 'lost',
  },
  conflict: {
    label: 'Conflict of interest',
    shortLabel: 'Declined',
    hint: 'Firm cannot act',
    outcome: 'declined',
  },
  outside: {
    label: 'Outside practice areas',
    shortLabel: 'Declined',
    hint: 'Not a matter we handle',
    outcome: 'declined',
  },
  limitations: {
    label: 'Limitation period passed',
    shortLabel: 'Declined',
    hint: 'Claim is time-barred',
    outcome: 'declined',
  },
  referred: {
    label: 'Referred out',
    shortLabel: 'Referred',
    hint: 'Passed to a trusted firm',
    outcome: 'declined',
  },
};

export type StatusMove =
  { to: Exclude<Status, 'closed'> } | { to: 'closed'; closeReason: CloseReason; note: string };

export const matterTypeSchema = z.enum([
  'Family',
  'Employment',
  'Property',
  'Immigration',
  'Criminal defence',
  'Personal injury',
  'Corporate',
]);
export type MatterType = z.infer<typeof matterTypeSchema>;

export const sourceSchema = z.enum([
  'Referral',
  'Website form',
  'Phone call',
  'Walk-in',
  'Directory listing',
]);
export type Source = z.infer<typeof sourceSchema>;

export const preferredChannelSchema = z.enum(['phone', 'whatsapp', 'email']);
export type PreferredChannel = z.infer<typeof preferredChannelSchema>;

export const preferredChannelLabels: Record<PreferredChannel, string> = {
  phone: 'Phone',
  whatsapp: 'WhatsApp',
  email: 'Email',
};

export const attorneyIdSchema = z.enum(['is', 'lk', 'dm']);
export type AttorneyId = z.infer<typeof attorneyIdSchema>;

export const attorneys: Record<AttorneyId, { name: string; shortName: string; role: string }> = {
  is: { name: 'Imran Sheikh', shortName: 'I. Sheikh', role: 'Litigation' },
  lk: { name: 'Laila Karim', shortName: 'L. Karim', role: 'Family & immigration' },
  dm: { name: 'David Mercer', shortName: 'D. Mercer', role: 'Corporate & employment' },
};

export const conflictCheckSchema = z.enum(['pending', 'cleared', 'flagged']);
export type ConflictCheck = z.infer<typeof conflictCheckSchema>;

export const conflictCheckLabels: Record<ConflictCheck, string> = {
  pending: 'Conflict check pending',
  cleared: 'Conflict check cleared',
  flagged: 'Possible conflict',
};

export const contactFieldLabels: Record<string, string> = {
  name: 'name',
  email: 'email',
  phone: 'phone',
  preferredChannel: 'preferred contact',
  matterType: 'matter type',
  summary: 'summary',
  source: 'source',
  referredBy: 'referrer',
  attorneyId: 'attorney',
  followUpAt: 'follow-up date',
  conflictCheck: 'conflict check',
};

export const contactSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  preferredChannel: preferredChannelSchema,
  matterType: matterTypeSchema,
  summary: z.string(),
  source: sourceSchema,
  referredBy: z.string(),
  attorneyId: attorneyIdSchema.nullable(),
  conflictCheck: conflictCheckSchema,
  status: statusSchema,
  closeReason: closeReasonSchema.nullable(),
  followUpAt: z.iso.datetime().nullable(),
  createdAt: z.iso.datetime(),
  statusChangedAt: z.iso.datetime(),
  lastContactedAt: z.iso.datetime().nullable(),
});
export type Contact = z.infer<typeof contactSchema>;

export const activityTypeSchema = z.enum([
  'created',
  'call',
  'email',
  'note',
  'consultation',
  'conflict_check',
  'status_change',
  'edit',
]);
export type ActivityType = z.infer<typeof activityTypeSchema>;

export const activitySchema = z.object({
  id: z.string(),
  contactId: z.string(),
  at: z.iso.datetime(),
  actor: z.string(),
  type: activityTypeSchema,
  body: z.string().nullable(),
  from: statusSchema.optional(),
  to: statusSchema.optional(),
  closeReason: closeReasonSchema.nullable().optional(),
  changedFields: z.array(z.string()).optional(),
  flagged: z.boolean().optional(),
});
export type Activity = z.infer<typeof activitySchema>;

export type ActivityEntry = {
  type: Extract<ActivityType, 'note' | 'call' | 'email'>;
  body: string;
};

export const storeSchema = z.object({
  version: z.literal(1),
  contacts: z.array(contactSchema),
  activities: z.array(activitySchema),
});
export type Store = z.infer<typeof storeSchema>;
