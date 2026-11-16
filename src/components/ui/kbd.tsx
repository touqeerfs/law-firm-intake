import type { ReactNode } from 'react';

type KbdProps = {
  children: ReactNode;
};

export function Kbd({ children }: KbdProps) {
  return (
    <kbd className="inline-grid h-4.5 min-w-4.5 place-items-center rounded-xs border border-b-2 border-border bg-surface-2 px-1 text-2xs text-muted">
      {children}
    </kbd>
  );
}
