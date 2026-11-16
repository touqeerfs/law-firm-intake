import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cx } from '@/lib/cx';

type InsightTone = 'warn' | 'accent' | 'active' | 'won';
type NoteTone = 'muted' | 'ok' | 'warn' | 'danger';

type InsightTileProps = {
  icon: LucideIcon;
  tone: InsightTone;
  label: string;
  value: string | number;
  note?: string;
  noteTone?: NoteTone;
  isPressed?: boolean;
  onClick?: () => void;
  children: ReactNode;
};

const iconClasses: Record<InsightTone, string> = {
  warn: 'bg-warn-bg text-warn-fg',
  accent: 'bg-accent-soft text-accent-text',
  active: 'bg-active-bg text-active-fg',
  won: 'bg-won-bg text-won-fg',
};

const noteClasses: Record<NoteTone, string> = {
  muted: 'text-muted',
  ok: 'text-won-fg',
  warn: 'text-warn-fg',
  danger: 'text-danger-fg',
};

const tileClasses =
  'relative flex min-w-0 shrink-0 basis-3/4 snap-start flex-col gap-1.5 bg-surface px-4 py-3.5 text-left';

const pressableClasses =
  'transition-colors hover:bg-surface-2 aria-pressed:bg-accent-soft aria-pressed:after:absolute aria-pressed:after:inset-x-0 aria-pressed:after:bottom-0 aria-pressed:after:h-0.5 aria-pressed:after:bg-accent';

export function InsightTile({
  icon: Icon,
  tone,
  label,
  value,
  note,
  noteTone = 'muted',
  isPressed,
  onClick,
  children,
}: InsightTileProps) {
  const content = (
    <>
      <span className="flex items-center gap-1.75 text-sm font-semibold text-muted">
        <span
          className={cx('grid size-5.5 shrink-0 place-items-center rounded-xs', iconClasses[tone])}
        >
          <Icon className="size-3.25" aria-hidden />
        </span>
        {label}
      </span>
      <span className="flex items-baseline gap-2">
        <span className="font-display text-3xl font-semibold tracking-tighter tabular-nums">
          {value}
        </span>
        {note && (
          <small className={cx('text-sm font-semibold', noteClasses[noteTone])}>{note}</small>
        )}
      </span>
      <span className="flex min-h-4 items-center gap-2 text-xs text-muted">{children}</span>
    </>
  );

  if (!onClick) return <div className={tileClasses}>{content}</div>;

  return (
    <button
      type="button"
      aria-pressed={isPressed}
      onClick={onClick}
      className={cx(tileClasses, pressableClasses)}
    >
      {content}
    </button>
  );
}

export function InsightTileSkeleton() {
  return (
    <div className={tileClasses}>
      <Skeleton className="h-2.5 w-1/2" />
      <Skeleton className="mt-1.5 h-5.5 w-1/3" />
      <Skeleton className="mt-1 h-2 w-2/3" />
    </div>
  );
}
