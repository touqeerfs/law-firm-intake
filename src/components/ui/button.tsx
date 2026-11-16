import type { ComponentProps } from 'react';
import { cx } from '@/lib/cx';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md';

type ButtonStyle = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconOnly?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-on-accent shadow-primary hover:bg-accent-hover',
  secondary:
    'border-border bg-surface text-text shadow-xs hover:border-border-strong hover:bg-surface-2',
  ghost: 'text-text-2 hover:bg-surface-3 hover:text-text',
  danger: 'bg-danger text-on-accent hover:bg-danger-fg',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-11 px-2.5 text-sm desktop:h-7.5',
  md: 'h-11 px-3.25 text-md desktop:h-8.5',
};

const iconOnlySizeClasses: Record<ButtonSize, string> = {
  sm: 'size-11 desktop:size-6.5',
  md: 'size-11 desktop:size-8',
};

export function buttonClasses({
  variant = 'secondary',
  size = 'md',
  iconOnly = false,
}: ButtonStyle = {}): string {
  return cx(
    'inline-flex shrink-0 items-center justify-center gap-1.75 rounded-sm border border-transparent font-semibold whitespace-nowrap transition active:translate-y-px disabled:cursor-not-allowed disabled:opacity-55',
    variantClasses[variant],
    iconOnly ? iconOnlySizeClasses[size] : sizeClasses[size],
  );
}

type ButtonProps = ComponentProps<'button'> &
  ButtonStyle &
  ({ iconOnly?: false } | { iconOnly: true; 'aria-label': string });

export function Button({
  variant,
  size,
  iconOnly,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(buttonClasses({ variant, size, iconOnly }), className)}
      {...props}
    />
  );
}
