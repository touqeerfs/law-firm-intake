'use client';

import type { ReactNode } from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';

type DialogProps = {
  title: string;
  description: string;
  onClose: () => void;
  children: ReactNode;
};

export function Dialog({ title, description, onClose, children }: DialogProps) {
  return (
    <RadixDialog.Root open onOpenChange={(open) => !open && onClose()}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-50 bg-text/30 backdrop-blur-xs" />
        <RadixDialog.Content className="fixed inset-x-0 bottom-0 z-50 max-h-dvh overflow-y-auto rounded-t-xl border border-border bg-surface pb-safe shadow-lg desktop:top-1/2 desktop:right-auto desktop:bottom-auto desktop:left-1/2 desktop:w-140 desktop:-translate-1/2 desktop:rounded-xl desktop:pb-0">
          <div className="px-5.5 pt-5">
            <RadixDialog.Title className="font-display text-xl font-semibold tracking-tight">
              {title}
            </RadixDialog.Title>
            <RadixDialog.Description className="mt-1 text-muted">
              {description}
            </RadixDialog.Description>
          </div>
          {children}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
