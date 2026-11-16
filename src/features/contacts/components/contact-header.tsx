import Link from 'next/link';
import { Briefcase, Pencil, Phone } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { buttonClasses } from '@/components/ui/button';
import { Tag } from '@/components/ui/tag';
import { cx } from '@/lib/cx';
import type { Contact } from '../contact-model';
import { phoneHref } from '../contact-rules';
import { ConflictCheckTag, OutcomePill, StatusPill } from './contact-fields';

type ContactHeaderProps = {
  contact: Contact;
};

const actionClasses = cx(buttonClasses(), 'flex-1 @header-row:flex-none');

export function ContactHeader({ contact }: ContactHeaderProps) {
  return (
    <header className="mb-4 flex flex-col gap-4 @header-row:flex-row @header-row:items-start @header-row:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <Avatar name={contact.name} size="lg" />
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-semibold tracking-tighter @header-row:text-4xl">
            {contact.name}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <StatusPill status={contact.status} />
            {contact.status === 'closed' && contact.closeReason && (
              <OutcomePill closeReason={contact.closeReason} />
            )}
            <Tag icon={Briefcase}>{contact.matterType}</Tag>
            <ConflictCheckTag conflictCheck={contact.conflictCheck} />
            <Tag tone="outline">
              <span className="font-mono">{contact.id}</span>
            </Tag>
          </div>
        </div>
      </div>

      <div className="flex gap-1.5">
        {contact.phone && (
          <a href={phoneHref(contact.phone)} className={actionClasses}>
            <Phone className="size-3.75" aria-hidden />
            Call
          </a>
        )}
        <Link href={`/contacts/${contact.id}/edit`} className={actionClasses}>
          <Pencil className="size-3.75" aria-hidden />
          Edit
        </Link>
      </div>
    </header>
  );
}
