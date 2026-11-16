import { Skeleton } from '@/components/ui/skeleton';
import { cx } from '@/lib/cx';

const nameWidths = ['w-1/2', 'w-3/5', 'w-2/5', 'w-4/5', 'w-1/2', 'w-3/4', 'w-2/5', 'w-3/5'];

export function ContactsListSkeleton() {
  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border border-border bg-surface shadow-xs wide:block">
        <div className="h-9.5 border-b border-border bg-surface-2" />
        {nameWidths.map((width, index) => (
          <div
            key={index}
            className="flex h-14.5 items-center gap-3 border-b border-border px-3.5 last:border-b-0"
          >
            <Skeleton className="size-7.5" />
            <div className="flex-1">
              <Skeleton className={cx('h-2.5', width)} />
              <Skeleton className="mt-2 h-2 w-1/4" />
            </div>
            <Skeleton className="h-5.5 w-16" />
            <Skeleton className="h-2.5 w-24" />
            <Skeleton className="h-2.5 w-20" />
            <Skeleton className="h-2.5 w-16" />
          </div>
        ))}
      </div>

      <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface wide:hidden">
        {nameWidths.slice(0, 6).map((width, index) => (
          <li key={index} className="flex items-start gap-3 p-3.5">
            <Skeleton className="size-7.5" />
            <div className="flex-1">
              <Skeleton className={cx('h-2.5', width)} />
              <Skeleton className="mt-2.5 h-2 w-2/5" />
              <Skeleton className="mt-3 h-5 w-1/2" />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
