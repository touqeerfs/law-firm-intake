import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cx } from '@/lib/cx';

type BannerTone = 'danger' | 'neutral';

type BannerProps = {
  tone: BannerTone;
  icon: LucideIcon;
  title: string;
  children: ReactNode;
  action?: ReactNode;
  role?: 'alert';
};

const toneClasses: Record<BannerTone, string> = {
  danger: 'border-danger/25 bg-danger-bg text-danger-fg',
  neutral: 'border-border bg-surface-2 text-text-2',
};

export function Banner({ tone, icon: Icon, title, children, action, role }: BannerProps) {
  return (
    <div
      role={role}
      className={cx(
        'flex flex-wrap items-start gap-x-3 gap-y-2.5 rounded-lg border px-3.5 py-3',
        toneClasses[tone],
      )}
    >
      <Icon className="mt-px size-4.5 shrink-0" aria-hidden />
      <div className="min-w-0 flex-1 basis-56">
        <p className="font-semibold">{title}</p>
        <p className="opacity-92">{children}</p>
      </div>
      {action && <div className="ml-7.5 shrink-0 desktop:ml-auto">{action}</div>}
    </div>
  );
}
