'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { cx } from '@/lib/cx';
import { navItems, type NavItemId } from './nav-items';

type NavLinkVariant = 'sidebar' | 'tab';
type NavCountTone = 'muted' | 'warn';

type NavLinkProps = {
  item: NavItemId;
  variant: NavLinkVariant;
  count?: number;
  countTone?: NavCountTone;
};

type NavAnchorProps = NavLinkProps & {
  view: string | null;
};

const linkClasses: Record<NavLinkVariant, string> = {
  sidebar:
    'flex h-8 items-center gap-2.5 rounded-sm pr-2 pl-2.5 text-md font-medium text-text-2 transition-colors hover:bg-text/5 hover:text-text aria-[current=page]:bg-canvas aria-[current=page]:text-text aria-[current=page]:shadow-sm',
  tab: 'flex min-h-11.5 flex-col items-center justify-center gap-0.75 rounded-sm py-1.5 text-2xs font-semibold text-muted aria-[current=page]:text-accent-text',
};

const iconClasses: Record<NavLinkVariant, string> = {
  sidebar: 'size-4 text-muted group-aria-[current=page]:text-accent',
  tab: 'size-5',
};

const countClasses: Record<NavCountTone, string> = {
  muted: 'text-xs text-muted',
  warn: 'rounded-xs bg-warn-bg px-1.5 text-xs leading-4.5 font-semibold text-warn-fg',
};

function isCurrentItem(item: NavItemId, pathname: string, view: string | null): boolean {
  const onDueView = pathname === '/contacts' && view === 'due';
  if (item === 'followUpsDue') return onDueView;

  const { href } = navItems[item];
  return !onDueView && (pathname === href || pathname.startsWith(`${href}/`));
}

function NavAnchor({ item, variant, count, countTone = 'muted', view }: NavAnchorProps) {
  const pathname = usePathname();
  const { href, label, shortLabel, icon: Icon } = navItems[item];

  return (
    <Link
      href={href}
      aria-current={isCurrentItem(item, pathname, view) ? 'page' : undefined}
      className={cx('group', linkClasses[variant])}
    >
      <Icon className={iconClasses[variant]} aria-hidden />
      {variant === 'tab' ? shortLabel : label}
      {count !== undefined && (
        <span className={cx('ml-auto tabular-nums', countClasses[countTone])}>{count}</span>
      )}
    </Link>
  );
}

function NavAnchorWithView(props: NavLinkProps) {
  const view = useSearchParams().get('view');
  return <NavAnchor {...props} view={view} />;
}

export function NavLink(props: NavLinkProps) {
  return (
    <Suspense fallback={<NavAnchor {...props} view={null} />}>
      <NavAnchorWithView {...props} />
    </Suspense>
  );
}
