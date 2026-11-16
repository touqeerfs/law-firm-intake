'use client';

import type { KeyboardEvent, ReactNode } from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { Button } from './button';
import { useReturnFocus } from './use-return-focus';

type DrawerProps = {
  title: string;
  actions: ReactNode;
  onClose: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
  children: ReactNode;
};

export function Drawer({ title, actions, onClose, onKeyDown, children }: DrawerProps) {
  const returnFocus = useReturnFocus();

  return (
    <RadixDialog.Root open onOpenChange={(open) => !open && onClose()}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-50 bg-overlay" />
        <RadixDialog.Content
          aria-describedby={undefined}
          onCloseAutoFocus={returnFocus}
          onKeyDown={onKeyDown}
          className="fixed inset-x-0 bottom-0 z-50 flex h-11/12 flex-col overflow-hidden rounded-t-xl border border-border bg-canvas shadow-lg desktop:inset-y-2 desktop:right-2 desktop:left-auto desktop:h-auto desktop:w-125 desktop:rounded-xl"
        >
          <div className="flex h-12.5 shrink-0 items-center gap-1.5 border-b border-border pr-2.5 pl-4">
            <RadixDialog.Title className="mr-auto text-2xs font-semibold tracking-wider text-muted uppercase">
              {title}
            </RadixDialog.Title>
            {actions}
            <RadixDialog.Close asChild>
              <Button
                variant="ghost"
                size="sm"
                iconOnly
                aria-label={`Close ${title.toLowerCase()}`}
                title="Close (Esc)"
              >
                <X className="size-4" aria-hidden />
              </Button>
            </RadixDialog.Close>
          </div>
          <div className="flex-1 overflow-y-auto px-4.5 pt-4.5 pb-8">{children}</div>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
