import type { ComponentProps } from 'react';
import { ChevronDown } from 'lucide-react';
import { cx } from '@/lib/cx';

const inputClasses =
  'w-full rounded-sm border border-border-strong bg-surface px-3 shadow-xs transition-colors placeholder:text-muted hover:border-faint focus:border-accent focus:ring-3 focus:ring-accent/30 focus:outline-none aria-invalid:border-danger aria-invalid:focus:ring-danger/20';

export function TextInput({ className, ...props }: ComponentProps<'input'>) {
  return <input className={cx(inputClasses, 'h-11 desktop:h-9.5', className)} {...props} />;
}

export function TextArea({ className, ...props }: ComponentProps<'textarea'>) {
  return (
    <textarea
      className={cx(inputClasses, 'block min-h-26 resize-y py-2.5 leading-5.25', className)}
      {...props}
    />
  );
}

export function Select({ className, ...props }: ComponentProps<'select'>) {
  return (
    <div className="relative">
      <select
        className={cx(
          inputClasses,
          'h-11 cursor-pointer appearance-none pr-8 desktop:h-9.5',
          className,
        )}
        {...props}
      />
      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-faint"
        aria-hidden
      />
    </div>
  );
}
