'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ArrowUpDown, Check, ChevronDown } from 'lucide-react';
import { buttonClasses } from '@/components/ui/button';
import { contactSorts, contactSortSchema, type ContactSort } from '../contact-rules';

type SortMenuProps = {
  sort: ContactSort;
  onSortChange: (sort: ContactSort) => void;
};

export function SortMenu({ sort, onSortChange }: SortMenuProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className={buttonClasses({ variant: 'ghost', size: 'sm' })}>
        <ArrowUpDown className="size-3.5" aria-hidden />
        <span className="sr-only">Sort by </span>
        {contactSorts[sort].label}
        <ChevronDown className="size-3.5" aria-hidden />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          collisionPadding={12}
          className="z-50 min-w-57.5 rounded-md border border-border bg-surface p-1.25 shadow-lg"
        >
          <DropdownMenu.Label className="px-2.25 pt-2 pb-1.25 text-2xs font-semibold tracking-wider text-faint uppercase">
            Sort by
          </DropdownMenu.Label>
          <DropdownMenu.RadioGroup
            value={sort}
            onValueChange={(value) => onSortChange(contactSortSchema.parse(value))}
          >
            {contactSortSchema.options.map((option) => (
              <DropdownMenu.RadioItem
                key={option}
                value={option}
                className="flex cursor-pointer items-center gap-2.5 rounded-sm px-2.25 py-1.75 font-medium outline-none data-highlighted:bg-surface-3"
              >
                {contactSorts[option].label}
                <DropdownMenu.ItemIndicator className="ml-auto text-accent">
                  <Check className="size-3.5" aria-hidden />
                </DropdownMenu.ItemIndicator>
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
