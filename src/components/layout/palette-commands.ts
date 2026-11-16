import { Keyboard, PhoneIncoming, Plus, type LucideIcon } from 'lucide-react';
import { navItems } from './nav-items';

export type PaletteCommand = {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  keys?: string[];
  run: () => void;
};

type CommandActions = {
  navigate: (href: string) => void;
  showShortcuts: () => void;
};

export function paletteCommands({ navigate, showShortcuts }: CommandActions): PaletteCommand[] {
  const { pipeline, contacts, followUpsDue } = navItems;
  return [
    {
      title: 'Log a new inquiry',
      subtitle: 'Open the intake form',
      icon: Plus,
      keys: ['N'],
      run: () => navigate('/contacts/new'),
    },
    {
      title: 'Go to pipeline',
      icon: pipeline.icon,
      keys: ['G', 'P'],
      run: () => navigate(pipeline.href),
    },
    {
      title: 'Go to contacts',
      icon: contacts.icon,
      keys: ['G', 'C'],
      run: () => navigate(contacts.href),
    },
    {
      title: 'Show follow-ups due',
      icon: followUpsDue.icon,
      run: () => navigate(followUpsDue.href),
    },
    {
      title: 'Show inquiries not contacted yet',
      icon: PhoneIncoming,
      run: () => navigate('/contacts?view=not-contacted'),
    },
    { title: 'Keyboard shortcuts', icon: Keyboard, keys: ['?'], run: showShortcuts },
  ];
}
