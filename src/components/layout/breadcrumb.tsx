'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

type Crumb = {
  label: string;
  href?: string;
};

const contactsCrumb: Crumb = { label: 'Contacts', href: '/contacts' };

function crumbsFor(pathname: string): Crumb[] {
  const [section, id, action, ...rest] = pathname.split('/').filter(Boolean);

  if (section === 'pipeline' && !id) return [{ label: 'Pipeline' }];
  if (section !== 'contacts' || rest.length > 0) return [{ label: 'Not found' }];
  if (!id) return [{ label: 'Contacts' }];
  if (id === 'new' && !action) return [contactsCrumb, { label: 'New inquiry' }];
  if (!action) return [contactsCrumb, { label: id }];
  if (action === 'edit') {
    return [contactsCrumb, { label: id, href: `/contacts/${id}` }, { label: 'Edit' }];
  }
  return [{ label: 'Not found' }];
}

export function Breadcrumb() {
  const crumbs = crumbsFor(usePathname());

  return (
    <nav aria-label="Breadcrumb" className="hidden min-w-0 desktop:block">
      <ol className="flex items-center gap-1.5 text-md text-muted">
        {crumbs.map((crumb, index) => (
          <li key={crumb.label} className="flex min-w-0 items-center gap-1.5">
            {index > 0 && <ChevronRight className="size-3.25 text-faint" aria-hidden />}
            {crumb.href ? (
              <Link href={crumb.href} className="hover:text-text">
                {crumb.label}
              </Link>
            ) : (
              <span aria-current="page" className="truncate font-semibold text-text">
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
