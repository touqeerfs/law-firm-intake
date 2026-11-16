import { useId, type ReactNode } from 'react';

type CardProps = {
  title: string;
  children: ReactNode;
};

export function Card({ title, children }: CardProps) {
  const headingId = useId();

  return (
    <section
      aria-labelledby={headingId}
      className="rounded-lg border border-border bg-surface shadow-xs"
    >
      <h2 id={headingId} className="px-4 pt-3.5 font-semibold">
        {title}
      </h2>
      <div className="px-4 pt-3 pb-4">{children}</div>
    </section>
  );
}
