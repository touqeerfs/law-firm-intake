import Link from 'next/link';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ExternalLink, MoreHorizontal } from 'lucide-react';
import { buttonClasses } from '@/components/ui/button';
import {
  statusDetails,
  statusSchema,
  type Contact,
  type Status,
} from '@/features/contacts/contact-model';
import { cx } from '@/lib/cx';
import { firstName } from '@/lib/text';
import { statusDotClasses } from '@/features/contacts/components/contact-fields';

type CardMenuProps = {
  contact: Contact;
  onMove: (contact: Contact, to: Status) => void;
};

const itemClasses =
  'flex cursor-pointer items-center gap-2.5 rounded-sm px-2.25 py-1.75 font-medium outline-none data-highlighted:bg-surface-3';

export function CardMenu({ contact, onMove }: CardMenuProps) {
  const targets = statusSchema.options.filter((status) => status !== contact.status);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        aria-label={`Move ${contact.name}`}
        className={buttonClasses({ variant: 'ghost', size: 'sm', iconOnly: true })}
      >
        <MoreHorizontal className="size-3.75" aria-hidden />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          collisionPadding={12}
          className="z-50 min-w-57.5 rounded-md border border-border bg-surface p-1.25 shadow-lg"
        >
          <DropdownMenu.Label className="px-2.25 pt-2 pb-1.25 text-2xs font-semibold tracking-wider text-muted uppercase">
            Move {firstName(contact.name)} to
          </DropdownMenu.Label>
          {targets.map((status) => (
            <DropdownMenu.Item
              key={status}
              onSelect={() => onMove(contact, status)}
              className={cx(itemClasses, 'items-start')}
            >
              <span
                aria-hidden
                className={cx('mt-1.75 size-1.75 shrink-0 rounded-full', statusDotClasses[status])}
              />
              <span>
                {statusDetails[status].label}
                <span className="block text-xs font-normal text-muted">
                  {statusDetails[status].hint}
                </span>
              </span>
            </DropdownMenu.Item>
          ))}
          <DropdownMenu.Separator className="mx-0.5 my-1.25 h-px bg-border" />
          <DropdownMenu.Item asChild className={itemClasses}>
            <Link href={`/contacts/${contact.id}`}>
              <ExternalLink className="size-3.5 text-muted" aria-hidden />
              Open full record
            </Link>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
