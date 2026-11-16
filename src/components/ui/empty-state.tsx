import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
  action?: ReactNode;
};

export function EmptyState({ icon: Icon, title, children, action }: EmptyStateProps) {
  return (
    <section className="flex flex-col items-center rounded-xl border border-border bg-surface px-6 py-14 text-center">
      <span className="mb-4 grid size-12 place-items-center rounded-xl bg-accent-soft text-accent-text">
        <Icon className="size-5.5" aria-hidden />
      </span>
      <h2 className="font-display text-xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-1.5 max-w-md text-muted">{children}</p>
      {action && <div className="mt-4.5 flex flex-wrap justify-center gap-2">{action}</div>}
    </section>
  );
}
