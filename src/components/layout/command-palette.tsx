'use client';

import { useEffect, useId, useState, type KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import * as RadixDialog from '@radix-ui/react-dialog';
import { Search } from 'lucide-react';
import { Kbd } from '@/components/ui/kbd';
import { useReturnFocus } from '@/components/ui/use-return-focus';
import type { Contact } from '@/features/contacts/contact-model';
import { matchesSearch, sortContacts } from '@/features/contacts/contact-rules';
import { useContacts } from '@/features/contacts/use-contacts';
import { normalizeText } from '@/lib/text';
import { paletteCommands } from './palette-commands';
import { PaletteFooter } from './palette-footer';
import { PaletteGroup } from './palette-item';
import { CommandOption, ContactOption, NoMatchesOption } from './palette-options';

type CommandPaletteProps = {
  onClose: () => void;
  onShowShortcuts: () => void;
};

const RECENT_LIMIT = 5;
const MATCH_LIMIT = 8;

function contactsFor(contacts: Contact[], search: string): Contact[] {
  if (search === '') return sortContacts(contacts, 'newest').slice(0, RECENT_LIMIT);
  return contacts.filter((contact) => matchesSearch(contact, search)).slice(0, MATCH_LIMIT);
}

export function CommandPalette({ onClose, onShowShortcuts }: CommandPaletteProps) {
  const router = useRouter();
  const returnFocus = useReturnFocus();
  const listId = useId();
  const { data } = useContacts();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);

  function go(href: string) {
    onClose();
    router.push(href);
  }

  const search = query.trim();
  const contacts = contactsFor(data ?? [], search);
  const commands = paletteCommands({ go, showShortcuts: onShowShortcuts }).filter((command) =>
    normalizeText(command.title).includes(normalizeText(search)),
  );
  const optionCount = Math.max(contacts.length + commands.length, 1);
  const activeIndex = Math.min(selected, optionCount - 1);
  const optionId = (index: number) => `${listId}-option-${index}`;
  const activeId = optionId(activeIndex);

  useEffect(() => {
    document.getElementById(activeId)?.scrollIntoView({ block: 'nearest' });
  }, [activeId]);

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const step = event.key === 'ArrowDown' ? 1 : -1;
      setSelected((activeIndex + step + optionCount) % optionCount);
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      document.getElementById(activeId)?.click();
    }
  }

  const optionProps = (index: number) => ({
    id: optionId(index),
    selected: index === activeIndex,
    onHover: () => setSelected(index),
  });

  return (
    <RadixDialog.Root open onOpenChange={(open) => !open && onClose()}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-50 bg-text/30 backdrop-blur-xs" />
        <RadixDialog.Content
          aria-describedby={undefined}
          onCloseAutoFocus={returnFocus}
          className="fixed inset-x-2 top-2 z-50 overflow-hidden rounded-xl border border-border bg-surface shadow-lg desktop:top-24 desktop:right-auto desktop:left-1/2 desktop:w-160 desktop:-translate-x-1/2"
        >
          <RadixDialog.Title className="sr-only">Search and commands</RadixDialog.Title>
          <div className="flex h-14 items-center gap-3 border-b border-border px-4.5 text-muted">
            <Search className="size-4.5 shrink-0" aria-hidden />
            <input
              role="combobox"
              aria-label="Search contacts or commands"
              aria-expanded
              aria-controls={listId}
              aria-activedescendant={activeId}
              aria-autocomplete="list"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setSelected(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search contacts, or type a command…"
              autoComplete="off"
              spellCheck={false}
              className="h-full min-w-0 flex-1 bg-transparent text-text outline-none placeholder:text-muted"
            />
            <span aria-hidden className="hidden desktop:block">
              <Kbd>Esc</Kbd>
            </span>
          </div>

          <div
            id={listId}
            role="listbox"
            aria-label="Contacts and commands"
            className="max-h-105 overflow-y-auto p-1.5"
          >
            {contacts.length > 0 && (
              <PaletteGroup label={search === '' ? 'Recently added' : 'Contacts'}>
                {contacts.map((contact, index) => (
                  <ContactOption
                    key={contact.id}
                    {...optionProps(index)}
                    contact={contact}
                    search={search}
                    onSelect={() => go(`/contacts/${contact.id}`)}
                  />
                ))}
              </PaletteGroup>
            )}
            {commands.length > 0 && (
              <PaletteGroup label="Commands">
                {commands.map((command, index) => (
                  <CommandOption
                    key={command.title}
                    {...optionProps(contacts.length + index)}
                    command={command}
                    onSelect={command.run}
                  />
                ))}
              </PaletteGroup>
            )}
            {contacts.length + commands.length === 0 && (
              <NoMatchesOption
                {...optionProps(0)}
                search={search}
                onSelect={() => go(`/contacts/new?name=${encodeURIComponent(search)}`)}
              />
            )}
          </div>

          <PaletteFooter />
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
