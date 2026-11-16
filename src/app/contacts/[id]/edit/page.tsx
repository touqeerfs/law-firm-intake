import { ContactEditor } from '@/features/contacts/components/contact-editor';

export default async function EditContactPage({ params }: PageProps<'/contacts/[id]/edit'>) {
  const { id } = await params;
  return <ContactEditor id={id} />;
}
