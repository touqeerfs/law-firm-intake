import type { Metadata } from 'next';
import { ContactForm } from '@/features/contacts/components/contact-form';

export const metadata: Metadata = { title: 'New inquiry' };

export default async function NewContactPage({ searchParams }: PageProps<'/contacts/new'>) {
  const { name } = await searchParams;
  return <ContactForm initialName={typeof name === 'string' ? name : ''} />;
}
