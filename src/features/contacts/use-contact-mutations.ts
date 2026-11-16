import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getContactsRepository } from './browser-repository';
import type { ActivityEntry } from './contact-model';
import { contactKeys } from './query-keys';

type AddActivityVariables = ActivityEntry & {
  contactId: string;
};

export function useContactMutations() {
  const queryClient = useQueryClient();

  const addActivity = useMutation({
    mutationFn: ({ contactId, ...entry }: AddActivityVariables) =>
      getContactsRepository().addActivity(contactId, entry),
    // Returning the promise keeps the mutation pending until the timeline has refetched, so the entry never blinks out
    onSuccess: (_activity, { contactId }) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: contactKeys.detail(contactId) }),
        queryClient.invalidateQueries({ queryKey: contactKeys.list() }),
      ]),
  });

  return { addActivity };
}
