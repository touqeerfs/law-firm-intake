import type { Contact } from '@/features/contacts/contact-model';

type BoardSummaryProps = {
  contacts: Contact[];
};

export function BoardSummary({ contacts }: BoardSummaryProps) {
  const open = contacts.filter((contact) => contact.status !== 'closed').length;
  return (
    <>
      <span aria-hidden className="size-1.75 rounded-full bg-won ring-3 ring-won/22" />
      {contacts.length} {contacts.length === 1 ? 'inquiry' : 'inquiries'} · {open} open
    </>
  );
}
