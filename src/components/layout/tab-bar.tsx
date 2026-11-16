import { NavLink } from './nav-link';

export function TabBar() {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-3 border-t border-border bg-canvas/92 px-1.5 pt-1.5 pb-safe backdrop-blur-md desktop:hidden"
    >
      <NavLink item="pipeline" variant="tab" />
      <NavLink item="contacts" variant="tab" />
      <NavLink item="followUpsDue" variant="tab" />
    </nav>
  );
}
