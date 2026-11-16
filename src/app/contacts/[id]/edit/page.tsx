import { PageHeader } from '@/components/layout/page-header';

export default async function EditContactPage({ params }: PageProps<'/contacts/[id]/edit'>) {
  const { id } = await params;
  return <PageHeader title={`Edit ${id}`} />;
}
