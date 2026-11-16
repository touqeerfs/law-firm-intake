import { SidebarSearchButton } from './palette-buttons';
import { SidebarNav } from './sidebar-nav';
import { WorkspaceMark } from './workspace-mark';

export function Sidebar() {
  return (
    <div className="sticky top-0 hidden h-dvh w-62 shrink-0 flex-col gap-1 self-start py-3 pr-2.5 pl-3 desktop:flex">
      <div className="flex items-center gap-2.5 px-2 pt-1.5 pb-2.5">
        <WorkspaceMark size="md" />
        <div>
          <p className="font-display leading-4.5 font-semibold tracking-snug">Intake Desk</p>
          <p className="text-xs text-muted">Karim, Sheikh &amp; Mercer</p>
        </div>
      </div>

      <SidebarSearchButton />
      <SidebarNav />

      <div className="mt-auto flex items-center gap-2.5 p-2">
        <span
          aria-hidden
          className="grid size-6 place-items-center rounded-full bg-accent-soft text-2xs font-semibold text-accent-text"
        >
          HM
        </span>
        <div>
          <p className="text-sm font-semibold">Hira Malik</p>
          <p className="text-xs text-muted">Intake coordinator</p>
        </div>
      </div>
    </div>
  );
}
