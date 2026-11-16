import { Kbd, KeyCombo } from '@/components/ui/kbd';

export function PaletteFooter() {
  return (
    <div
      aria-hidden
      className="hidden gap-4 border-t border-border bg-surface-2 px-4 py-2.5 text-xs text-muted desktop:flex"
    >
      <span className="inline-flex items-center gap-1.5">
        <KeyCombo keys={['↑', '↓']} />
        navigate
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Kbd>↵</Kbd>
        open
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Kbd>Esc</Kbd>
        close
      </span>
    </div>
  );
}
