'use client';

import { useState, type ReactNode } from 'react';
import { CommandPalette } from './command-palette';
import { ShortcutsDialog } from './shortcuts-dialog';
import { useGlobalShortcuts, type ShellDialog } from './use-global-shortcuts';

type ShellDialogsProps = {
  children: ReactNode;
};

export function ShellDialogs({ children }: ShellDialogsProps) {
  const [openDialog, setOpenDialog] = useState<ShellDialog | null>(null);
  useGlobalShortcuts(setOpenDialog);

  const close = () => setOpenDialog(null);

  return (
    <>
      {children}
      {openDialog === 'palette' && (
        <CommandPalette onClose={close} onShowShortcuts={() => setOpenDialog('shortcuts')} />
      )}
      {openDialog === 'shortcuts' && <ShortcutsDialog onClose={close} />}
    </>
  );
}
