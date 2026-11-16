'use client';

import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { KeyCombo } from '@/components/ui/kbd';
import { useOpenPalette } from './shell-dialogs';

export function SidebarSearchButton() {
  const openPalette = useOpenPalette();
  return (
    <button
      type="button"
      onClick={openPalette}
      aria-keyshortcuts="Meta+K Control+K"
      className="mt-0.5 mb-2.5 flex h-8.5 w-full items-center gap-2 rounded-sm border border-border bg-canvas pr-2 pl-2.5 text-sm text-muted shadow-xs transition-colors hover:border-border-strong hover:text-text-2"
    >
      <Search className="size-3.5" aria-hidden />
      Search or jump to…
      <span aria-hidden className="ml-auto flex gap-0.5">
        <KeyCombo keys={['⌘', 'K']} />
      </span>
    </button>
  );
}

export function MobileSearchButton() {
  const openPalette = useOpenPalette();
  return (
    <Button
      variant="ghost"
      iconOnly
      aria-label="Search"
      onClick={openPalette}
      className="desktop:hidden"
    >
      <Search className="size-4.25" aria-hidden />
    </Button>
  );
}
