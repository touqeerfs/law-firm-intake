import { storeSchema, type Activity, type Contact, type Store } from './contact-model';
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

const STORAGE_KEY = 'intake-desk/data';

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

  return {
    async listContacts(): Promise<Contact[]> {
      await simulateNetwork();
      return readStore().contacts;
    },

    async getContact(id: string): Promise<{ contact: Contact; activities: Activity[] }> {
      await simulateNetwork();
      const store = readStore();
      const contact = store.contacts.find((candidate) => candidate.id === id);
      if (!contact) throw new RepositoryError('not_found');

      const activities = store.activities
        .filter((activity) => activity.contactId === id)
        .sort((a, b) => b.at.localeCompare(a.at));
      return { contact, activities };
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
