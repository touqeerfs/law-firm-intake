import { PageHeader } from '@/components/layout/page-header';

export default async function ContactPage({ params }: PageProps<'/contacts/[id]'>) {
  const { id } = await params;
  return <PageHeader title={id} />;
}
