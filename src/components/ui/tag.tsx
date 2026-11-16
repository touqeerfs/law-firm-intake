import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cx } from '@/lib/cx';

type TagTone = 'neutral' | 'warn' | 'danger';

type TagProps = {
  tone?: TagTone;
  icon?: LucideIcon;
  children: ReactNode;
};

const toneClasses: Record<TagTone, string> = {
  neutral: 'bg-surface-3 text-text-2',
  warn: 'bg-warn-bg text-warn-fg',
  danger: 'bg-danger-bg text-danger-fg',
};

export function Tag({ tone = 'neutral', icon: Icon, children }: TagProps) {
  return (
    <span
      className={cx(
        'inline-flex h-5.5 items-center gap-1.25 rounded-xs px-1.75 text-xs font-semibold whitespace-nowrap',
        toneClasses[tone],
      )}
    >
      {Icon && <Icon className="size-3" aria-hidden />}
      {children}
    </span>
  );
}
