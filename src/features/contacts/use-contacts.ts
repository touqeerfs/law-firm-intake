import { useQuery } from '@tanstack/react-query';
import { getContactsRepository } from './browser-repository';
import { contactKeys } from './query-keys';

export function useContacts() {
  return useQuery({
    queryKey: contactKeys.list(),
    queryFn: () => getContactsRepository().listContacts(),
  });
}

export function useContact(id: string) {
  return useQuery({
    queryKey: contactKeys.detail(id),
    queryFn: () => getContactsRepository().getContact(id),
  });
}

export function useActivities() {
  return useQuery({
    queryKey: contactKeys.activities(),
    queryFn: () => getContactsRepository().listActivities(),
  });
}
