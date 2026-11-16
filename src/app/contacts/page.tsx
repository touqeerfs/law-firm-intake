import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/page-header';

export const metadata: Metadata = { title: 'Contacts' };

export default function ContactsPage() {
  return <PageHeader title="Contacts" />;
}
