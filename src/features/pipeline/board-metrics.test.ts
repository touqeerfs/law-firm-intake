import { describe, expect, it } from 'vitest';
import type { Activity, Contact } from '@/features/contacts/contact-model';
import { boardMetrics } from './board-metrics';

const now = new Date(2026, 10, 16, 15);

function localIso(day: number, hour = 10, minute = 0): string {
  return new Date(2026, 10, day, hour, minute).toISOString();
}

function buildContact(overrides: Partial<Contact> = {}): Contact {
  return {
    id: 'INT-1001',
    name: 'Sana Iqbal',
    email: 'sana.iqbal@example.com',
    phone: '+92 300 1234567',
    preferredChannel: 'phone',
    matterType: 'Family',
    summary: 'Needs advice on a custody arrangement.',
    source: 'Website form',
    referredBy: '',
    attorneyId: null,
    conflictCheck: 'pending',
    status: 'lead',
    closeReason: null,
    followUpAt: null,
    createdAt: localIso(10),
    statusChangedAt: localIso(10),
    lastContactedAt: null,
    ...overrides,
  };
}

function buildActivity(contactId: string, type: Activity['type'], at: string): Activity {
  return { id: `act_${contactId}_${at}`, contactId, at, actor: 'Hira Malik', type, body: null };
}

describe('boardMetrics', () => {
  it('takes the median time from a contact being created to their first call or email', () => {
    const contacts = [
      buildContact({ id: 'INT-1001' }),
      buildContact({ id: 'INT-1002' }),
      buildContact({ id: 'INT-1003' }),
      buildContact({ id: 'INT-1004' }),
    ];
    const activities = [
      buildActivity('INT-1001', 'email', localIso(10, 12)),
      buildActivity('INT-1001', 'call', localIso(10, 10, 30)),
      buildActivity('INT-1002', 'note', localIso(10, 10, 5)),
      buildActivity('INT-1002', 'email', localIso(10, 11, 30)),
      buildActivity('INT-1003', 'call', localIso(10, 13)),
      buildActivity('INT-1004', 'note', localIso(10, 10, 10)),
    ];

    const metrics = boardMetrics(contacts, activities, now);

    expect(metrics.medianFirstResponseMs).toBe(5_400_000);
    expect(metrics.withinTargetPercent).toBe(33);
  });

  it('counts closes from the last 30 days by outcome and gives the share retained', () => {
    const closed = (closeReason: Contact['closeReason'], day: number) =>
      buildContact({ status: 'closed', closeReason, statusChangedAt: localIso(day) });
    const contacts = [
      closed('retained', 14),
      closed('retained', 2),
      closed('hired_other', 12),
      closed('unresponsive', 5),
      closed('conflict', 9),
      buildContact({
        status: 'closed',
        closeReason: 'retained',
        statusChangedAt: new Date(2026, 9, 1).toISOString(),
      }),
      buildContact({ status: 'active' }),
    ];

    const metrics = boardMetrics(contacts, [], now);

    expect(metrics.closedCount).toBe(5);
    expect(metrics.outcomes).toEqual({ won: 2, lost: 2, declined: 1 });
    expect(metrics.retentionPercent).toBe(40);
  });
});
