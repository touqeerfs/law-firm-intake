import { useState } from 'react';

export function useReturnFocus() {
  const [opener] = useState(() => document.activeElement);

  return function returnFocus(event: Event) {
    event.preventDefault();
    if (opener instanceof HTMLElement && opener.isConnected) opener.focus();
    else if (document.activeElement === document.body) document.getElementById('main')?.focus();
  };
}
