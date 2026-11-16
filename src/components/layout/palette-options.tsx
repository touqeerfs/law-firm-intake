import { Plus } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Highlight } from '@/components/ui/highlight';
import { Kbd } from '@/components/ui/kbd';
import { ContactStatusPill } from '@/features/contacts/components/contact-fields';
import { attorneys, type Contact } from '@/features/contacts/contact-model';
import type { PaletteCommand } from './palette-commands';
import { PaletteIcon, PaletteItem, PaletteText, type PaletteOptionProps } from './palette-item';

type ContactOptionProps = PaletteOptionProps & {
  contact: Contact;
  search: string;
};

type NoMatchesOptionProps = PaletteOptionProps & {
  search: string;
};

type CommandOptionProps = PaletteOptionProps & {
  command: PaletteCommand;
};

function contactSubtitle(contact: Contact): string {
  const attorney = contact.attorneyId ? attorneys[contact.attorneyId].name : 'Unassigned';
  return `${contact.id} · ${contact.matterType} · ${attorney}`;
}

export function ContactOption({ contact, search, ...optionProps }: ContactOptionProps) {
  return (
    <PaletteItem {...optionProps}>
      <Avatar name={contact.name} />
      <PaletteText
        title={<Highlight text={contact.name} query={search} />}
        subtitle={contactSubtitle(contact)}
      />
      <ContactStatusPill contact={contact} />
    </PaletteItem>
  );
}

export function NoMatchesOption({ search, ...optionProps }: NoMatchesOptionProps) {
  return (
    <>
      <p className="px-4 pt-5 pb-3 text-center text-muted">
        No contacts or commands match &ldquo;{search}&rdquo;.
      </p>
      <PaletteItem {...optionProps}>
        <PaletteIcon icon={Plus} />
        <PaletteText title={`Log “${search}” as a new inquiry`} />
      </PaletteItem>
    </>
  );
}

export function CommandOption({ command, ...optionProps }: CommandOptionProps) {
  return (
    <PaletteItem {...optionProps}>
      <PaletteIcon icon={command.icon} />
      <PaletteText title={command.title} subtitle={command.subtitle} />
      {command.keys && (
        <span aria-hidden className="hidden gap-1 desktop:flex">
          {command.keys.map((key) => (
            <Kbd key={key}>{key}</Kbd>
          ))}
        </span>
      )}
    </PaletteItem>
  );
}
