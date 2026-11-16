import { useEffect, type Dispatch, type SetStateAction } from 'react';
import { useRouter } from 'next/navigation';
import { isLayerOpen, isTypingIn, PAGE_SEARCH_ID } from '@/lib/keyboard';

export type ShellDialog = 'palette' | 'shortcuts';

const GO_TO_WINDOW_MS = 1000;

export function useGlobalShortcuts(setOpenDialog: Dispatch<SetStateAction<ShellDialog | null>>) {
  const router = useRouter();

  useEffect(() => {
    let goPressedAt = 0;

    function focusPageSearchOrOpenPalette() {
      const pageSearch = document.getElementById(PAGE_SEARCH_ID);
      if (pageSearch) pageSearch.focus();
      else setOpenDialog('palette');
    }

    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpenDialog((current) => (current === 'palette' ? null : 'palette'));
        return;
      }
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTypingIn(event.target) || isLayerOpen()) return;

      const key = event.key.toLowerCase();
      if (Date.now() - goPressedAt < GO_TO_WINDOW_MS) {
        goPressedAt = 0;
        if (key === 'p') router.push('/pipeline');
        if (key === 'c') router.push('/contacts');
        return;
      }

      if (key === 'g') goPressedAt = Date.now();
      else if (key === 'n') router.push('/contacts/new');
      else if (key === '?') setOpenDialog('shortcuts');
      else if (key === '/') focusPageSearchOrOpenPalette();
      else return;
      event.preventDefault();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [router, setOpenDialog]);
}
