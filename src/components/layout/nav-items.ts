import { Clock, SquareKanban, Users, type LucideIcon } from 'lucide-react';

type NavItem = {
  href: string;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
};

export const navItems = {
  pipeline: { href: '/pipeline', label: 'Pipeline', shortLabel: 'Pipeline', icon: SquareKanban },
  contacts: { href: '/contacts', label: 'Contacts', shortLabel: 'Contacts', icon: Users },
  followUpsDue: {
    href: '/contacts?view=due',
    label: 'Follow-ups due',
    shortLabel: 'Due',
    icon: Clock,
  },
} satisfies Record<string, NavItem>;

export type NavItemId = keyof typeof navItems;
