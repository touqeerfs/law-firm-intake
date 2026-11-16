import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

type ErrorBannerProps = {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
  action: ReactNode;
};

export function ErrorBanner({ icon: Icon, title, children, action }: ErrorBannerProps) {
  return (
    <div
      role="alert"
      className="flex flex-wrap items-start gap-x-3 gap-y-2.5 rounded-lg border border-danger/25 bg-danger-bg px-3.5 py-3 text-danger-fg"
    >
      <Icon className="mt-px size-4.5 shrink-0" aria-hidden />
      <div className="min-w-0 flex-1 basis-56">
        <p className="font-semibold">{title}</p>
        <p className="opacity-92">{children}</p>
      </div>
      <div className="ml-7.5 shrink-0 desktop:ml-auto">{action}</div>
    </div>
  );
}
