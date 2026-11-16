import type { ReactNode } from 'react';

type PageHeaderProps = {
  title: string;
  description?: ReactNode;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="mb-4.5">
      <h1 className="font-display text-2xl font-semibold tracking-tight desktop:text-3xl">
        {title}
      </h1>
      {description && (
        <p className="mt-1 flex min-h-5 flex-wrap items-center gap-2 text-muted">{description}</p>
      )}
    </header>
  );
}
