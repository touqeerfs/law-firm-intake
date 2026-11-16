import { createContactsRepository, type ContactsRepository } from './contacts-repository';
import { readNetworkMode, type NetworkMode } from './network-mode';

let repository: ContactsRepository | undefined;

function latency(mode: NetworkMode): number {
  return mode === 'slow' ? 1600 : 300 + Math.random() * 200;
}

export function getContactsRepository(): ContactsRepository {
  // Created on first use, which only happens in the browser, so the server never reads localStorage
  repository ??= createContactsRepository({
    storage: window.localStorage,
    latency,
    getNetworkMode: readNetworkMode,
  });
  return repository;
}
