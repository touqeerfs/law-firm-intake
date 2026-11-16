import type { ComponentProps, ReactNode } from 'react';

type ChoiceProps = Omit<ComponentProps<'input'>, 'type'>;

type ChoiceGroupProps = {
  legend: string;
  hint?: ReactNode;
  children: ReactNode;
};

export function Choice({ children, ...props }: ChoiceProps) {
  return (
    <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-sm border border-border-strong bg-surface px-3 text-md font-semibold text-text-2 shadow-xs transition-colors hover:border-faint hover:text-text has-checked:border-accent has-checked:bg-accent-soft has-checked:text-accent-text has-checked:inset-ring-1 has-checked:inset-ring-accent has-focus-visible:ring-3 has-focus-visible:ring-accent/30">
      <input type="radio" className="sr-only" {...props} />
      {children}
    </label>
  );
}

export function ChoiceGroup({ legend, hint, children }: ChoiceGroupProps) {
  return (
    <fieldset className="min-w-0 desktop:col-span-2">
      <legend className="mb-1.5 text-sm font-semibold text-text-2">{legend}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
      {hint && <p className="mt-1.5 text-sm text-muted">{hint}</p>}
    </fieldset>
  );
}
