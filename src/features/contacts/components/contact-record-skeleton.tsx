import { Skeleton } from '@/components/ui/skeleton';
import { cx } from '@/lib/cx';

const factWidths = ['w-1/2', 'w-3/5', 'w-2/3', 'w-3/4', 'w-4/5'];

export function ContactRecordSkeleton() {
  return (
    <div aria-busy>
      <span className="sr-only">Loading contact…</span>
      <div className="mb-4 flex items-center gap-4">
        <Skeleton className="size-14" />
        <div className="flex-1">
          <Skeleton className="h-6 w-56 max-w-full" />
          <Skeleton className="mt-3 h-2.5 w-64 max-w-full" />
        </div>
      </div>
      <div className="mb-4.5 h-10.5 animate-pulse rounded-md bg-surface-3" />

      <div className="flex flex-col gap-4.5 @two-column:flex-row @two-column:items-start">
        <div className="rounded-lg border border-border bg-surface p-4 @two-column:w-95 @two-column:shrink-0">
          {factWidths.map((width, index) => (
            <Skeleton key={width} className={cx('h-2.5', width, index > 0 && 'mt-4.5')} />
          ))}
        </div>
        <div className="min-w-0 flex-1">
          <div className="h-30 animate-pulse rounded-lg bg-surface-3" />
          {factWidths.slice(0, 3).map((width) => (
            <div key={width} className="mt-5 flex gap-3">
              <div className="size-7.5 animate-pulse rounded-md bg-surface-3" />
              <div className="flex-1">
                <Skeleton className={cx('h-2.5', width)} />
                <div className="mt-2.5 h-10 animate-pulse rounded-md bg-surface-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
