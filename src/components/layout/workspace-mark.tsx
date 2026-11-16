import { Scale } from 'lucide-react';
import { cx } from '@/lib/cx';

type WorkspaceMarkProps = {
  size: 'sm' | 'md';
};

export function WorkspaceMark({ size }: WorkspaceMarkProps) {
  return (
    <span
      aria-hidden
      className={cx(
        'grid shrink-0 place-items-center rounded-sm bg-linear-to-br from-accent to-accent-hover text-on-accent shadow-sm',
        size === 'md' ? 'size-7.5' : 'size-7',
      )}
    >
      <Scale className="size-4" />
    </span>
  );
}
