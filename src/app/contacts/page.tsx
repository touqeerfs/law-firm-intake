import type { Metadata } from 'next';
import { ContactsList } from '@/features/contacts/components/contacts-list';

export const metadata: Metadata = { title: 'Contacts' };

export default function ContactsPage() {
  return <ContactsList />;
}
