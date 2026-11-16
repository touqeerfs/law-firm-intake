import { Skeleton } from '@/components/ui/skeleton';

const cards = ['who', 'matter', 'intake'];
const fields = ['first', 'second', 'third', 'fourth'];

export function ContactFormSkeleton() {
  return (
    <div aria-busy className="mx-auto max-w-narrow">
      <span className="sr-only">Loading contact…</span>
      <Skeleton className="h-6.5 w-70 max-w-full" />
      <Skeleton className="mt-3 mb-6 h-2.5 w-90 max-w-full" />
      <div className="flex flex-col gap-3.5">
        {cards.map((card) => (
          <div key={card} className="rounded-lg border border-border bg-surface p-4.5">
            <Skeleton className="h-3.5 w-1/3" />
            <div className="grid gap-4 pt-4.5 desktop:grid-cols-2">
              {fields.map((field) => (
                <div key={field} className="flex flex-col gap-2">
                  <Skeleton className="h-2 w-1/3" />
                  <div className="h-9.5 animate-pulse rounded-sm bg-surface-3" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
