import { Flag, PhoneIncoming, Shield, User } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Tag } from '@/components/ui/tag';
import { FollowUpTag, OutcomePill } from '@/features/contacts/components/contact-fields';
import { attorneys, type Contact } from '@/features/contacts/contact-model';
import { isNotContacted } from '@/features/contacts/contact-rules';
import { formatRelative } from '@/lib/dates';

type CardDetailProps = {
  contact: Contact;
};

export function ConflictMark({ contact }: CardDetailProps) {
  if (contact.conflictCheck === 'flagged') {
    return (
      <span title="Possible conflict" className="mt-0.5 text-danger-fg">
        <Flag className="size-3.75" aria-hidden />
        <span className="sr-only">Possible conflict</span>
      </span>
    );
  }
  if (contact.status === 'lead' && contact.conflictCheck === 'pending') {
    return (
      <span title="Conflict check pending" className="mt-0.5 text-warn-fg">
        <Shield className="size-3.75" aria-hidden />
        <span className="sr-only">Conflict check pending</span>
      </span>
    );
  }
  return null;
}

export function CardTags({ contact }: CardDetailProps) {
  if (contact.status === 'closed') {
    return contact.closeReason && <OutcomePill closeReason={contact.closeReason} />;
  }
  return (
    <>
      <FollowUpTag contact={contact} />
      {isNotContacted(contact) && (
        <Tag tone="warn" icon={PhoneIncoming}>
          Not contacted · {formatRelative(contact.createdAt).replace(' ago', '')}
        </Tag>
      )}
      {contact.conflictCheck === 'flagged' && (
        <Tag tone="danger" icon={Flag}>
          Conflict
        </Tag>
      )}
    </>
  );
}

export function AttorneyAvatar({ contact }: CardDetailProps) {
  if (contact.attorneyId === null) {
    return (
      <span
        title="Unassigned"
        className="grid size-5 place-items-center rounded-full border border-dashed border-border-strong text-faint"
      >
        <User className="size-2.75" aria-hidden />
        <span className="sr-only">Unassigned</span>
      </span>
    );
  }
  const { name } = attorneys[contact.attorneyId];
  return (
    <span title={name} className="inline-flex">
      <Avatar name={name} size="xs" />
      <span className="sr-only">Assigned to {name}</span>
    </span>
  );
}
