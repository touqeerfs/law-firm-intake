import type { ReactNode } from 'react';
import { CircleAlert } from 'lucide-react';
import { cx } from '@/lib/cx';

type FieldMessageTone = 'error' | 'help' | 'warn';

type FieldMessageProps = {
  id: string;
  tone: FieldMessageTone;
  children: ReactNode;
};

type FieldProps = {
  htmlFor: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  wide?: boolean;
  error?: string;
  hint?: ReactNode;
  hintTone?: 'help' | 'warn';
  aside?: ReactNode;
  children: ReactNode;
};

const messageToneClasses: Record<FieldMessageTone, string> = {
  error: 'text-danger-fg',
  help: 'text-muted',
  warn: 'text-warn-fg',
};

export function fieldMessageId(fieldId: string): string {
  return `${fieldId}-message`;
}

export function FieldMessage({ id, tone, children }: FieldMessageProps) {
  return (
    <p id={id} className={cx('flex items-start gap-1.5 text-sm', messageToneClasses[tone])}>
      {tone !== 'help' && <CircleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden />}
      <span>{children}</span>
    </p>
  );
}

export function Field({
  htmlFor,
  label,
  required = false,
  optional = false,
  wide = false,
  error,
  hint,
  hintTone = 'help',
  aside,
  children,
}: FieldProps) {
  const messageId = fieldMessageId(htmlFor);

  return (
    <div className={cx('flex min-w-0 flex-col gap-1.5', wide && 'desktop:col-span-2')}>
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={htmlFor} className="text-sm font-semibold text-text-2">
          {label}
          {required && (
            <span aria-hidden className="ml-0.5 text-danger">
              *
            </span>
          )}
          {optional && <span className="ml-1 font-medium text-muted">optional</span>}
        </label>
        {aside}
      </div>
      {children}
      {error ? (
        <FieldMessage id={messageId} tone="error">
          {error}
        </FieldMessage>
      ) : (
        hint && (
          <FieldMessage id={messageId} tone={hintTone}>
            {hint}
          </FieldMessage>
        )
      )}
    </div>
  );
}
