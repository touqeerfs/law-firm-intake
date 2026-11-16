'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cx } from '@/lib/cx';
import { navItems, type NavItemId } from './nav-items';

type NavLinkVariant = 'sidebar' | 'tab';

type NavLinkProps = {
  item: NavItemId;
  variant: NavLinkVariant;
};

const linkClasses: Record<NavLinkVariant, string> = {
  sidebar:
    'flex h-8 items-center gap-2.5 rounded-sm px-2.5 text-md font-medium text-text-2 transition-colors hover:bg-text/5 hover:text-text aria-[current=page]:bg-canvas aria-[current=page]:text-text aria-[current=page]:shadow-sm',
  tab: 'flex min-h-11.5 flex-col items-center justify-center gap-0.75 rounded-sm py-1.5 text-2xs font-semibold text-muted aria-[current=page]:text-accent-text',
};

const iconClasses: Record<NavLinkVariant, string> = {
  sidebar: 'size-4 text-muted group-aria-[current=page]:text-accent',
  tab: 'size-5',
};

function isCurrentPath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLink({ item, variant }: NavLinkProps) {
  const pathname = usePathname();
  const { href, label, shortLabel, icon: Icon } = navItems[item];

  return (
    <Link
      href={href}
      aria-current={isCurrentPath(pathname, href) ? 'page' : undefined}
      className={cx('group', linkClasses[variant])}
    >
      <Icon className={iconClasses[variant]} aria-hidden />
      {variant === 'tab' ? shortLabel : label}
    </Link>
  );
}
