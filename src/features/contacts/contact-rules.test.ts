import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Contact } from './contact-model';
import {
  isDue,
  isNotContacted,
  isOverdue,
  listViews,
  matchesSearch,
  sortContacts,
  timeInStatus,
} from './contact-rules';

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

const closed = { status: 'closed', closeReason: 'retained' } as const;

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 10, 16, 12));
});

afterEach(() => {
  vi.useRealTimers();
});

describe('follow-ups', () => {
  it('counts today and yesterday as due, but not tomorrow', () => {
    expect(isDue(buildContact({ followUpAt: localIso(16, 17) }))).toBe(true);
    expect(isDue(buildContact({ followUpAt: localIso(15) }))).toBe(true);
    expect(isDue(buildContact({ followUpAt: localIso(17) }))).toBe(false);
  });

  it('counts only yesterday as overdue', () => {
    expect(isOverdue(buildContact({ followUpAt: localIso(15) }))).toBe(true);
    expect(isOverdue(buildContact({ followUpAt: localIso(16) }))).toBe(false);
  });

  it('never treats a closed contact as due', () => {
    expect(isDue(buildContact({ ...closed, followUpAt: localIso(15) }))).toBe(false);
  });
});

describe('isNotContacted', () => {
  it('is true for an open contact nobody has called or emailed', () => {
    expect(isNotContacted(buildContact())).toBe(true);
  });

  it('is false for a closed contact', () => {
    expect(isNotContacted(buildContact(closed))).toBe(false);
  });
});

describe('timeInStatus', () => {
  it('warns at 7 days and flags 14 days as stalled', () => {
    expect(timeInStatus(buildContact({ statusChangedAt: localIso(13) }))).toEqual({
      days: 3,
      tone: 'ok',
    });
    expect(timeInStatus(buildContact({ statusChangedAt: localIso(8) })).tone).toBe('warn');
    expect(timeInStatus(buildContact({ statusChangedAt: localIso(1) })).tone).toBe('danger');
  });

  it('stays calm for a closed contact', () => {
    expect(timeInStatus(buildContact({ ...closed, statusChangedAt: localIso(1) })).tone).toBe(
      'neutral',
    );
  });
});

describe('matchesSearch', () => {
  const ayesha = buildContact({
    id: 'INT-1043',
    name: 'Ayesha Siddiqui',
    phone: '+92 300 8812044',
  });

  it('matches the name without caring about case or accents', () => {
    expect(matchesSearch(ayesha, 'AYESHA')).toBe(true);
    expect(matchesSearch(ayesha, 'Áyesha')).toBe(true);
  });

  it('matches the ID', () => {
    expect(matchesSearch(ayesha, 'int-1043')).toBe(true);
  });

  it('matches phone digits from three digits up', () => {
    expect(matchesSearch(ayesha, '8812')).toBe(true);
    expect(matchesSearch(ayesha, '88')).toBe(false);
  });

  it('matches everyone when the search is empty', () => {
    expect(matchesSearch(ayesha, '  ')).toBe(true);
  });
});

describe('listViews', () => {
  const dueToday = buildContact({ id: 'INT-1', followUpAt: localIso(16) });
  const dueNextWeek = buildContact({ id: 'INT-2', followUpAt: localIso(23) });
  const retained = buildContact({ id: 'INT-3', ...closed });
  const contacts = [dueToday, dueNextWeek, retained];

  it('keeps open contacts with a follow-up today or earlier in "due"', () => {
    expect(contacts.filter(listViews.due.matches)).toEqual([dueToday]);
  });

  it('keeps only closed contacts in "closed"', () => {
    expect(contacts.filter(listViews.closed.matches)).toEqual([retained]);
  });
});

describe('sortContacts', () => {
  it('puts contacts without a follow-up last when sorting by follow-up', () => {
    const contacts = [
      buildContact({ id: 'INT-1', followUpAt: null }),
      buildContact({ id: 'INT-2', followUpAt: localIso(20) }),
      buildContact({ id: 'INT-3', followUpAt: localIso(14) }),
    ];

    const ids = sortContacts(contacts, 'follow-up').map((contact) => contact.id);

    expect(ids).toEqual(['INT-3', 'INT-2', 'INT-1']);
  });
});
