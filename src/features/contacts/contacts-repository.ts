import { applyMove } from '@/features/pipeline/board-order';
import {
  COORDINATOR,
  storeSchema,
  type Activity,
  type ActivityEntry,
  type Contact,
  type ContactDetail,
  type ContactInput,
  type StatusMove,
  type Store,
} from './contact-model';
import type { NetworkMode } from './network-mode';
import { RepositoryError } from './repository-error';
import { buildSeed } from './seed-data';

export type KeyValueStorage = Pick<Storage, 'getItem' | 'setItem'>;

type RepositoryDependencies = {
  storage: KeyValueStorage;
  latency: (mode: NetworkMode) => number;
  getNetworkMode: () => NetworkMode;
};

export type ResetMode = 'sample' | 'empty';

export type MoveUndo = {
  contactId: string;
  previous: Pick<Contact, 'status' | 'closeReason' | 'followUpAt' | 'statusChangedAt'>;
  activityId: string;
};

const STORAGE_KEY = 'intake-desk/data';

const editTrackedFields = [
  'name',
  'email',
  'phone',
  'preferredChannel',
  'matterType',
  'summary',
  'source',
  'referredBy',
  'attorneyId',
  'followUpAt',
  'conflictCheck',
] as const satisfies ReadonlyArray<keyof ContactInput>;

type ActivityDetails = Omit<Activity, 'id' | 'contactId' | 'at' | 'actor'>;

function createActivity(contactId: string, at: string, details: ActivityDetails): Activity {
  return { id: `act_${crypto.randomUUID()}`, contactId, at, actor: COORDINATOR, ...details };
}

function nextContactId(contacts: Contact[]): string {
  const numbers = contacts.map((contact) => Number(contact.id.replace('INT-', '')) || 0);
  return `INT-${Math.max(1040, ...numbers) + 1}`;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function findContact(store: Store, id: string): Contact {
  const contact = store.contacts.find((candidate) => candidate.id === id);
  if (!contact) throw new RepositoryError('not_found');
  return contact;
}

function parseJson(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function createContactsRepository({
  storage,
  latency,
  getNetworkMode,
}: RepositoryDependencies) {
  async function simulateNetwork(): Promise<void> {
    const mode = getNetworkMode();
    await sleep(latency(mode));
    if (mode === 'failing') throw new RepositoryError('network');
  }

  function persist(raw: string): void {
    try {
      storage.setItem(STORAGE_KEY, raw);
    } catch {
      throw new RepositoryError('storage');
    }
  }

  function saveStore(store: Store): void {
    persist(JSON.stringify(store));
  }

  function readStore(): Store {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw === null) {
      const seed = buildSeed(new Date());
      saveStore(seed);
      return seed;
    }

    const result = storeSchema.safeParse(parseJson(raw));
    if (!result.success) throw new RepositoryError('corrupt');
    return result.data;
  }

  function write<T>(change: (store: Store) => T): T {
    const store = readStore();
    const result = change(store);
    saveStore(store);
    return result;
  }

  return {
    async listContacts(): Promise<Contact[]> {
      await simulateNetwork();
      return readStore().contacts;
    },

    async getContact(id: string): Promise<ContactDetail> {
      await simulateNetwork();
      const store = readStore();
      const contact = findContact(store, id);
      const activities = store.activities
        .filter((activity) => activity.contactId === id)
        .sort((a, b) => b.at.localeCompare(a.at));
      return { contact, activities };
    },

    async addActivity(id: string, entry: ActivityEntry): Promise<Activity> {
      await simulateNetwork();
      return write((store) => {
        const contact = findContact(store, id);
        const activity: Activity = {
          id: `act_${crypto.randomUUID()}`,
          contactId: id,
          at: new Date().toISOString(),
          actor: COORDINATOR,
          type: entry.type,
          body: entry.body,
        };
        store.activities.push(activity);
        if (entry.type !== 'note') contact.lastContactedAt = activity.at;
        return activity;
      });
    },

    async moveContact(id: string, move: StatusMove): Promise<{ contact: Contact; undo: MoveUndo }> {
      await simulateNetwork();
      return write((store) => {
        const contact = findContact(store, id);
        const { status, closeReason, followUpAt, statusChangedAt } = contact;
        Object.assign(contact, applyMove(contact, move, new Date()));

        const activity: Activity = {
          id: `act_${crypto.randomUUID()}`,
          contactId: id,
          at: contact.statusChangedAt,
          actor: COORDINATOR,
          type: 'status_change',
          body: move.to === 'closed' && move.note !== '' ? move.note : null,
          from: status,
          to: move.to,
          closeReason: contact.closeReason,
        };
        store.activities.push(activity);

        return {
          contact,
          undo: {
            contactId: id,
            previous: { status, closeReason, followUpAt, statusChangedAt },
            activityId: activity.id,
          },
        };
      });
    },

    async undoMove(undo: MoveUndo): Promise<void> {
      await simulateNetwork();
      write((store) => {
        Object.assign(findContact(store, undo.contactId), undo.previous);
        store.activities = store.activities.filter((activity) => activity.id !== undo.activityId);
      });
    },

    async createContact(input: ContactInput): Promise<Contact> {
      await simulateNetwork();
      return write((store) => {
        const now = new Date().toISOString();
        const contact: Contact = {
          ...input,
          id: nextContactId(store.contacts),
          createdAt: now,
          statusChangedAt: now,
          lastContactedAt: null,
        };
        store.contacts.push(contact);
        store.activities.push(createActivity(contact.id, now, { type: 'created', body: null }));
        if (contact.status !== 'lead') {
          store.activities.push(
            createActivity(contact.id, now, {
              type: 'status_change',
              body: null,
              from: 'lead',
              to: contact.status,
              closeReason: contact.closeReason,
            }),
          );
        }
        return contact;
      });
    },

    async updateContact(id: string, input: ContactInput): Promise<Contact> {
      await simulateNetwork();
      return write((store) => {
        const contact = findContact(store, id);
        const now = new Date().toISOString();
        const changedFields = editTrackedFields.filter((field) => contact[field] !== input[field]);

        if (contact.status !== input.status) {
          store.activities.push(
            createActivity(id, now, {
              type: 'status_change',
              body: null,
              from: contact.status,
              to: input.status,
              closeReason: input.closeReason,
            }),
          );
          contact.statusChangedAt = now;
        }
        if (changedFields.length > 0) {
          store.activities.push(
            createActivity(id, now, { type: 'edit', body: null, changedFields }),
          );
        }
        Object.assign(contact, input);
        return contact;
      });
    },

    async resetData(mode: ResetMode): Promise<void> {
      saveStore(
        mode === 'sample' ? buildSeed(new Date()) : { version: 1, contacts: [], activities: [] },
      );
    },

    async corruptData(): Promise<void> {
      persist('{"contacts": broken');
    },
  };
}

export type ContactsRepository = ReturnType<typeof createContactsRepository>;
