import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Kbd } from '@/components/ui/kbd';

type ShortcutsDialogProps = {
  onClose: () => void;
};

const shortcuts = [
  { label: 'Search or jump to anything', keys: ['⌘', 'K'] },
  { label: 'Search contacts', keys: ['/'] },
  { label: 'Log a new inquiry', keys: ['N'] },
  { label: 'Go to pipeline', keys: ['G', 'P'] },
  { label: 'Go to contacts', keys: ['G', 'C'] },
  { label: 'Save note or form', keys: ['⌘', '↵'] },
  { label: 'Close panel, menu or dialog', keys: ['Esc'] },
  { label: 'Show this list', keys: ['?'] },
];

export function ShortcutsDialog({ onClose }: ShortcutsDialogProps) {
  return (
    <Dialog
      title="Keyboard shortcuts"
      description="Built for an intake desk where hands stay on the keyboard during calls."
      onClose={onClose}
    >
      <dl className="mt-3.5 px-5.5">
        {shortcuts.map(({ label, keys }) => (
          <div
            key={label}
            className="flex items-center justify-between gap-3 border-b border-border py-2 last:border-b-0"
          >
            <dt className="text-text-2">{label}</dt>
            <dd className="flex gap-1">
              {keys.map((key) => (
                <Kbd key={key}>{key}</Kbd>
              ))}
            </dd>
          </div>
        ))}
      </dl>
      <div className="flex justify-end px-5.5 pt-3 pb-4.5">
        <Button onClick={onClose}>Close</Button>
      </div>
    </Dialog>
  );
}
