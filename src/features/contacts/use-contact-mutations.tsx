import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { applyMove, isReopen } from '@/features/pipeline/board-order';
import { firstName } from '@/lib/text';
import { getContactsRepository } from './browser-repository';
import {
  statusDetails,
  type ActivityEntry,
  type Contact,
  type ContactDetail,
  type ContactInput,
  type StatusMove,
} from './contact-model';
import type { MoveUndo } from './contacts-repository';
import { contactKeys } from './query-keys';

type AddActivityVariables = ActivityEntry & {
  contactId: string;
};

export type MoveVariables = {
  contact: Contact;
  move: StatusMove;
};

type UpdateContactVariables = {
  id: string;
  input: ContactInput;
};

const moveKey = [...contactKeys.all, 'move'] as const;

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

  const undoMove = useMutation({
    mutationFn: (undo: MoveUndo) => getContactsRepository().undoMove(undo),
    onError: () => toast.error("Couldn't undo. Move it back by hand."),
    onSettled: () => queryClient.invalidateQueries({ queryKey: contactKeys.all }),
  });

  const moveContact = useMutation({
    mutationKey: moveKey,
    mutationFn: ({ contact, move }: MoveVariables) =>
      getContactsRepository().moveContact(contact.id, move),

    onMutate: async ({ contact, move }) => {
      await queryClient.cancelQueries({ queryKey: contactKeys.all });
      const previousList = queryClient.getQueryData<Contact[]>(contactKeys.list());
      const previousDetail = queryClient.getQueryData<ContactDetail>(
        contactKeys.detail(contact.id),
      );

      const moved = applyMove(contact, move, new Date());
      queryClient.setQueryData<Contact[]>(contactKeys.list(), (contacts) =>
        contacts?.map((candidate) => (candidate.id === contact.id ? moved : candidate)),
      );
      queryClient.setQueryData<ContactDetail>(
        contactKeys.detail(contact.id),
        (detail) => detail && { ...detail, contact: moved },
      );
      return { previousList, previousDetail };
    },

    onError: (_error, { contact }, context) => {
      queryClient.setQueryData(contactKeys.list(), context?.previousList);
      queryClient.setQueryData(contactKeys.detail(contact.id), context?.previousDetail);
      toast.error(`Couldn't move ${contact.name}. Nothing was changed, so try again.`);
    },

    onSuccess: ({ undo }, { contact, move }) => {
      toast.success(
        <span>
          Moved {firstName(contact.name)} to <strong>{statusDetails[move.to].label}</strong>
          {isReopen(contact, move.to) && ' · follow-up set for today'}
        </span>,
        { action: { label: 'Undo', onClick: () => undoMove.mutate(undo) } },
      );
    },

    onSettled: () => {
      // Only the last move in flight refetches, so an early refetch can't undo a later optimistic move
      if (queryClient.isMutating({ mutationKey: moveKey }) === 1) {
        return queryClient.invalidateQueries({ queryKey: contactKeys.all });
      }
    },
  });

  const createContact = useMutation({
    mutationFn: (input: ContactInput) => getContactsRepository().createContact(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: contactKeys.all }),
  });

  const updateContact = useMutation({
    mutationFn: ({ id, input }: UpdateContactVariables) =>
      getContactsRepository().updateContact(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: contactKeys.all }),
  });

  return { addActivity, moveContact, createContact, updateContact };
}
