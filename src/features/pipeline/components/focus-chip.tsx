import { Filter, X } from 'lucide-react';
import { listViews } from '@/features/contacts/contact-rules';
import type { BoardFocus } from '../board-focus';

type FocusChipProps = {
  focus: BoardFocus;
  onClear: () => void;
};

export function FocusChip({ focus, onClear }: FocusChipProps) {
  return (
    <button
      type="button"
      onClick={onClear}
      className="inline-flex h-11 items-center gap-1.5 rounded-sm border border-accent/35 bg-accent-soft pr-1.5 pl-2.5 text-sm font-semibold text-accent-text transition-colors hover:border-accent/55 desktop:h-7.5"
    >
      <Filter className="size-3.25" aria-hidden />
      <span className="sr-only">Clear filter: </span>
      {listViews[focus].label}
      <X className="size-3.5" aria-hidden />
    </button>
  );
}
