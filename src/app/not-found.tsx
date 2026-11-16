import type { Metadata } from 'next';
import Link from 'next/link';
import { Folder } from 'lucide-react';
import { buttonClasses } from '@/components/ui/button';
import { cx } from '@/lib/cx';

export const metadata: Metadata = { title: 'Not found' };

export default function NotFound() {
  return (
    <section className="flex flex-col items-center rounded-xl border border-border bg-surface px-6 py-14 text-center">
      <span className="mb-4 grid size-12 place-items-center rounded-xl bg-accent-soft text-accent-text">
        <Folder className="size-5.5" aria-hidden />
      </span>
      <h1 className="font-display text-xl font-semibold tracking-tight">
        This page doesn&apos;t exist
      </h1>
      <p className="mt-1.5 max-w-sm text-muted">
        The link may be out of date. Everything on the intake desk is reachable from the pipeline or
        contacts.
      </p>
      <Link href="/pipeline" className={cx(buttonClasses({ variant: 'primary' }), 'mt-4.5')}>
        Go to pipeline
      </Link>
    </section>
  );
}
