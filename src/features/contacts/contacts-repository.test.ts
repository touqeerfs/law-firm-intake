import { describe, expect, it } from 'vitest';
import { createContactsRepository, type KeyValueStorage } from './contacts-repository';

function createMemoryStorage(): KeyValueStorage {
  const items = new Map<string, string>();
  return {
    getItem: (key) => items.get(key) ?? null,
    setItem: (key, value) => {
      items.set(key, value);
    },
  };
}

function createRepository(storage: KeyValueStorage) {
  return createContactsRepository({ storage, latency: () => 0, getNetworkMode: () => 'normal' });
}

describe('contacts repository', () => {
  it('keeps data for a new repository on the same storage', async () => {
    const storage = createMemoryStorage();
    await createRepository(storage).resetData('empty');

    const contacts = await createRepository(storage).listContacts();

    expect(contacts).toEqual([]);
  });

  it('throws a corrupt error when the stored JSON is broken', async () => {
    const storage = createMemoryStorage();
    storage.setItem('intake-desk/data', '{"contacts": broken');

    await expect(createRepository(storage).listContacts()).rejects.toMatchObject({
      code: 'corrupt',
    });
  });

  it('throws a storage error and keeps the previous data when saving fails', async () => {
    const storage = createMemoryStorage();
    await createRepository(storage).listContacts();
    const failingStorage: KeyValueStorage = {
      getItem: storage.getItem,
      setItem: () => {
        throw new Error('QuotaExceededError');
      },
    };
    const repository = createRepository(failingStorage);

    await expect(repository.resetData('empty')).rejects.toMatchObject({ code: 'storage' });
    expect(await repository.listContacts()).toHaveLength(19);
  });
});
