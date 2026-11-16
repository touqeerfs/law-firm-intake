import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

type FactProps = {
  icon: LucideIcon;
  label: string;
  children: ReactNode;
};

export function Fact({ icon: Icon, label, children }: FactProps) {
  return (
    <div className="flex min-h-9.5 items-center gap-2 border-t border-border py-1.5 first:border-t-0">
      <dt className="flex w-36 shrink-0 items-center gap-2 text-sm text-muted">
        <Icon className="mx-0.75 size-3.75 shrink-0 text-faint" aria-hidden />
        {label}
      </dt>
      <dd className="flex min-w-0 flex-1 flex-wrap items-center gap-x-1.5 gap-y-0.5 font-medium wrap-anywhere">
        {children}
      </dd>
    </div>
  );
}
