'use client';

import * as Popover from '@radix-ui/react-popover';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { NetworkMode } from '@/features/contacts/network-mode';
import { useDemoControls } from '@/features/contacts/use-demo-controls';
import { cx } from '@/lib/cx';

const networkOptions: { mode: NetworkMode; label: string }[] = [
  { mode: 'normal', label: 'Normal' },
  { mode: 'slow', label: 'Slow 1.6s' },
  { mode: 'failing', label: 'Failing' },
];

const dotClasses: Record<NetworkMode, string> = {
  normal: 'bg-won',
  slow: 'bg-warn',
  failing: 'bg-danger',
};

const groupLabelClasses = 'mb-1.75 block text-sm font-semibold text-text-2';

export function DemoControls() {
  const { networkMode, changeNetworkMode, changeData } = useDemoControls();

  return (
    <Popover.Root>
      <Popover.Trigger className="inline-flex size-8 items-center justify-center gap-2 rounded-full border border-dashed border-border-strong text-sm font-semibold text-text-2 transition-colors hover:border-solid hover:bg-surface-2 hover:text-text aria-expanded:border-solid aria-expanded:bg-surface-2 aria-expanded:text-text desktop:h-7.5 desktop:w-auto desktop:px-2.75">
        <span aria-hidden className={cx('size-1.75 rounded-full', dotClasses[networkMode])} />
        <span className="sr-only desktop:not-sr-only">Demo controls</span>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          collisionPadding={12}
          aria-label="Demo controls"
          className="z-50 w-85 rounded-2xl border border-border bg-surface p-4 shadow-lg"
        >
          <h2 className="font-display text-base font-semibold tracking-snug">Demo controls</h2>
          <p className="mt-0.5 text-sm text-muted">
            For reviewers. Simulate API conditions to see every loading, empty and error state. Data
            lives in this browser&apos;s localStorage.
          </p>

          <fieldset className="mt-3.5">
            <legend className={groupLabelClasses}>Network</legend>
            <div className="flex gap-0.5 rounded-md bg-surface-3 p-0.75">
              {networkOptions.map(({ mode, label }) => (
                <label key={mode} className="flex-1">
                  <input
                    type="radio"
                    name="network-mode"
                    value={mode}
                    checked={networkMode === mode}
                    onChange={() => changeNetworkMode(mode)}
                    className="peer sr-only"
                  />
                  <span className="flex h-7 cursor-pointer items-center justify-center rounded-sm text-sm font-semibold text-muted transition-colors peer-checked:bg-surface peer-checked:text-text peer-checked:shadow-sm peer-focus-visible:outline-3 peer-focus-visible:outline-accent/30 hover:text-text">
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-3.5">
            <legend className={groupLabelClasses}>Data</legend>
            <div className="flex flex-wrap gap-1.5">
              <Button size="sm" onClick={() => changeData('sample')}>
                <RefreshCw className="size-3.5" aria-hidden />
                Reset sample data
              </Button>
              <Button size="sm" onClick={() => changeData('empty')}>
                Start empty
              </Button>
              <Button size="sm" variant="ghost" onClick={() => changeData('corrupt')}>
                Corrupt storage
              </Button>
            </div>
          </fieldset>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
