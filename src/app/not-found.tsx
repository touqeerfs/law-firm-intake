import type { Metadata } from 'next';
import Link from 'next/link';
import { Folder } from 'lucide-react';
import { buttonClasses } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

export const metadata: Metadata = { title: 'Not found' };

export default function NotFound() {
  return (
    <EmptyState
      icon={Folder}
      title="This page doesn't exist"
      titleAs="h1"
      action={
        <Link href="/pipeline" className={buttonClasses({ variant: 'primary' })}>
          Go to pipeline
        </Link>
      }
    >
      The link may be out of date. Everything on the intake desk is reachable from the pipeline or
      contacts.
    </EmptyState>
  );
}
