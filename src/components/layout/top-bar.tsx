import Link from 'next/link';
import { Plus } from 'lucide-react';
import { buttonClasses } from '@/components/ui/button';
import { Breadcrumb } from './breadcrumb';
import { DemoControls } from './demo-controls';
import { WorkspaceMark } from './workspace-mark';

export function TopBar() {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-2.5 border-b border-border bg-canvas/86 pr-3 pl-4 backdrop-blur-md backdrop-saturate-140 desktop:top-2 desktop:h-13 desktop:rounded-t-xl desktop:pr-4 desktop:pl-5.5">
      <Link href="/pipeline" className="flex h-11 items-center gap-2.5 desktop:hidden">
        <WorkspaceMark size="sm" />
        <span className="font-display font-semibold tracking-snug">Intake Desk</span>
      </Link>

      <Breadcrumb />

      <div className="ml-auto flex items-center gap-1.5">
        <DemoControls />
        <Link href="/contacts/new" className={buttonClasses({ variant: 'primary', size: 'sm' })}>
          <Plus className="size-3.75" aria-hidden />
          <span className="hidden desktop:inline">Log inquiry</span>
          <span className="desktop:hidden">
            New<span className="sr-only"> inquiry</span>
          </span>
        </Link>
      </div>
    </header>
  );
}
