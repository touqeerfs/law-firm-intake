import { ContactRecord } from '@/features/contacts/components/contact-record';

export default async function ContactPage({ params }: PageProps<'/contacts/[id]'>) {
  const { id } = await params;
  return <ContactRecord id={id} />;
}
