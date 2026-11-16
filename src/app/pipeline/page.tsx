import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/page-header';

export const metadata: Metadata = { title: 'Pipeline' };

export default function PipelinePage() {
  return <PageHeader title="Pipeline" />;
}
