import { describe, expect, it } from 'vitest';
import type { Contact } from '@/features/contacts/contact-model';
import { applyMove, boardColumns } from './board-order';

function localIso(day: number, hour = 10): string {
  return new Date(2026, 10, day, hour).toISOString();
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
    createdAt: localIso(1),
    statusChangedAt: localIso(1),
    lastContactedAt: null,
    ...overrides,
  };
}

const names = (contacts: Contact[]) => contacts.map((contact) => contact.name);

describe('boardColumns', () => {
  it('puts overdue leads before today, then tomorrow, and no follow-up last', () => {
    const contacts = [
      buildContact({ name: 'No follow-up' }),
      buildContact({ name: 'Tomorrow', followUpAt: localIso(17) }),
      buildContact({ name: 'Overdue', followUpAt: localIso(14) }),
      buildContact({ name: 'Today', followUpAt: localIso(16) }),
    ];

    expect(names(boardColumns(contacts).lead)).toEqual([
      'Overdue',
      'Today',
      'Tomorrow',
      'No follow-up',
    ]);
  });

  it('puts the most recently closed contact first', () => {
    const closed = { status: 'closed', closeReason: 'retained' } as const;
    const contacts = [
      buildContact({ ...closed, name: 'Ali Raza', statusChangedAt: localIso(3) }),
      buildContact({ ...closed, name: 'Zara Khan', statusChangedAt: localIso(12) }),
      buildContact({ ...closed, name: 'Bilal Ahmed', statusChangedAt: localIso(8) }),
    ];

    expect(names(boardColumns(contacts).closed)).toEqual(['Zara Khan', 'Bilal Ahmed', 'Ali Raza']);
  });
});

describe('applyMove', () => {
  const now = new Date(2026, 10, 16, 15);

  it('sets the follow-up to today when a closed contact with none is reopened', () => {
    const contact = buildContact({ status: 'closed', closeReason: 'unresponsive' });

    const moved = applyMove(contact, { to: 'active' }, now);

    expect(moved).toMatchObject({
      status: 'active',
      closeReason: null,
      followUpAt: new Date(2026, 10, 16).toISOString(),
      statusChangedAt: now.toISOString(),
    });
  });

  it('clears the follow-up and records the reason when closing', () => {
    const contact = buildContact({ followUpAt: localIso(18) });

    const moved = applyMove(contact, { to: 'closed', closeReason: 'retained', note: '' }, now);

    expect(moved).toMatchObject({ status: 'closed', closeReason: 'retained', followUpAt: null });
  });
});
