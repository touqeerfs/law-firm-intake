import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type ColumnPlaceholderProps = {
  icon: LucideIcon;
  children: ReactNode;
};

export function ColumnPlaceholder({ icon: Icon, children }: ColumnPlaceholderProps) {
  return (
    <div className="rounded-md border border-dashed border-border-strong px-4 py-4.5 text-center text-sm text-muted">
      <Icon className="mx-auto mb-2 size-5 text-faint" aria-hidden />
      {children}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-md border border-border bg-surface p-3 shadow-xs">
      <div className="flex items-start gap-2.5">
        <Skeleton className="size-7.5" />
        <div className="flex-1">
          <Skeleton className="h-2.5 w-3/5" />
          <Skeleton className="mt-2 h-2 w-2/5" />
        </div>
      </div>
      <Skeleton className="mt-3.5 h-4.5 w-2/5" />
    </div>
  );
}
