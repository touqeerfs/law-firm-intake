import { useId, type ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

type FormCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  children: ReactNode;
};

export function FormCard({ icon: Icon, title, description, children }: FormCardProps) {
  const headingId = useId();

  return (
    <section
      aria-labelledby={headingId}
      className="rounded-lg border border-border bg-surface shadow-xs"
    >
      <div className="flex gap-3 px-4.5 pt-4">
        <span className="grid size-8 shrink-0 place-items-center rounded-sm bg-accent-soft text-accent-text">
          <Icon className="size-4" aria-hidden />
        </span>
        <div>
          <h2 id={headingId} className="font-semibold">
            {title}
          </h2>
          <p className="mt-px text-sm text-muted">{description}</p>
        </div>
      </div>
      <div className="grid gap-4 p-4.5 desktop:grid-cols-2">{children}</div>
    </section>
  );
}
