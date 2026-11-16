'use client';

import { useState, type ReactNode } from 'react';
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
      {openDialog === 'shortcuts' && <ShortcutsDialog onClose={close} />}
    </>
  );
}
