import { useId, type ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

type PaletteGroupProps = {
  label: string;
  children: ReactNode;
};

export type PaletteOptionProps = {
  id: string;
  selected: boolean;
  onSelect: () => void;
  onHover: () => void;
};

type PaletteItemProps = PaletteOptionProps & {
  children: ReactNode;
};

type PaletteIconProps = {
  icon: LucideIcon;
};

type PaletteTextProps = {
  title: ReactNode;
  subtitle?: ReactNode;
};

export function PaletteGroup({ label, children }: PaletteGroupProps) {
  const labelId = useId();
  return (
    <div role="presentation">
      <div
        id={labelId}
        aria-hidden
        className="px-2.5 pt-2.5 pb-1.5 text-2xs font-semibold tracking-wider text-muted uppercase"
      >
        {label}
      </div>
      <div role="group" aria-labelledby={labelId}>
        {children}
      </div>
    </div>
  );
}

export function PaletteItem({ id, selected, onSelect, onHover, children }: PaletteItemProps) {
  return (
    <div
      id={id}
      role="option"
      aria-selected={selected}
      onClick={onSelect}
      onMouseMove={onHover}
      className="group flex min-h-11 cursor-pointer items-center gap-3 rounded-md px-2.5 py-2 aria-selected:bg-surface-3"
    >
      {children}
    </div>
  );
}

export function PaletteIcon({ icon: Icon }: PaletteIconProps) {
  return (
    <span className="grid size-7 shrink-0 place-items-center rounded-sm bg-surface-3 text-text-2 group-aria-selected:bg-surface group-aria-selected:shadow-xs">
      <Icon className="size-3.75" aria-hidden />
    </span>
  );
}

export function PaletteText({ title, subtitle }: PaletteTextProps) {
  return (
    <span className="min-w-0 flex-1">
      <span className="block truncate font-semibold">{title}</span>
      {subtitle && <span className="block truncate text-xs text-muted">{subtitle}</span>}
    </span>
  );
}
