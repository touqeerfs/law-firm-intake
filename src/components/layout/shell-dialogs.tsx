'use client';

import { createContext, useContext, useRef, useState, type ReactNode } from 'react';
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

  const dialogAfterPalette = useRef<ShellDialog | null>(null);

  const close = () => setOpenDialog(null);

  function showShortcutsAfterPalette() {
    dialogAfterPalette.current = 'shortcuts';
    close();
  }

  function openDialogAfterPalette() {
    if (dialogAfterPalette.current === null) return;
    setOpenDialog(dialogAfterPalette.current);
    dialogAfterPalette.current = null;
  }

  return (
    <OpenPaletteContext value={() => setOpenDialog('palette')}>
      {children}
      {openDialog === 'palette' && (
        <CommandPalette
          onClose={close}
          onShowShortcuts={showShortcutsAfterPalette}
          onFocusReturned={openDialogAfterPalette}
        />
      )}
      {openDialog === 'shortcuts' && <ShortcutsDialog onClose={close} />}
    </OpenPaletteContext>
  );
}
