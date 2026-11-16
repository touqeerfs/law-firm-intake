import { useState } from 'react';

export function useReturnFocus() {
  const [opener] = useState(() => document.activeElement);

  return function returnFocus(event: Event) {
    event.preventDefault();
    const target =
      opener instanceof HTMLElement && opener.isConnected
        ? opener
        : document.getElementById('main');
    target?.focus();
  };
}
