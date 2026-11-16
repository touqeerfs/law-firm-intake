'use client';

import { isDue } from '@/features/contacts/contact-rules';
import { useContacts } from '@/features/contacts/use-contacts';
import { NavLink } from './nav-link';

export function SidebarNav() {
  const { data: contacts } = useContacts();
  const dueCount = contacts?.filter(isDue).length;

  return (
    <nav aria-label="Primary" className="flex flex-col gap-px">
      <NavLink item="pipeline" variant="sidebar" />
      <NavLink item="contacts" variant="sidebar" count={contacts?.length} />
      <p className="px-2.5 pt-3.5 pb-1.5 text-2xs font-semibold tracking-wider text-muted uppercase">
        Needs attention
      </p>
      <NavLink
        item="followUpsDue"
        variant="sidebar"
        count={dueCount === 0 ? undefined : dueCount}
        countTone="warn"
      />
    </nav>
  );
}
