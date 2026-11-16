import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/page-header';

export const metadata: Metadata = { title: 'New inquiry' };

export default function NewContactPage() {
  return <PageHeader title="Log a new inquiry" />;
}
