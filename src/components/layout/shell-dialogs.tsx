'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { CommandPalette } from './command-palette';
import { ShortcutsDialog } from './shortcuts-dialog';
import { useGlobalShortcuts, type ShellDialog } from './use-global-shortcuts';

type ShellDialogsProps = {
  children: ReactNode;
};

const OpenPaletteContext = createContext<(() => void) | null>(null);

export function useOpenPalette() {
  const openPalette = useContext(OpenPaletteContext);
  if (openPalette === null) throw new Error('useOpenPalette must be used inside ShellDialogs');
  return openPalette;
}

export function ShellDialogs({ children }: ShellDialogsProps) {
  const [openDialog, setOpenDialog] = useState<ShellDialog | null>(null);
  useGlobalShortcuts(setOpenDialog);

  const close = () => setOpenDialog(null);

  return (
    <OpenPaletteContext value={() => setOpenDialog('palette')}>
      {children}
      {openDialog === 'palette' && (
        <CommandPalette onClose={close} onShowShortcuts={() => setOpenDialog('shortcuts')} />
      )}
      {openDialog === 'shortcuts' && <ShortcutsDialog onClose={close} />}
    </OpenPaletteContext>
  );
}
