import { useRouter, useSearchParams } from 'next/navigation';
import {
  contactSortSchema,
  listViewSchema,
  type ContactSort,
  type ListView,
} from './contact-rules';

type ListParams = {
  query: string;
  view: ListView;
  sort: ContactSort;
};

const DEFAULT_VIEW: ListView = 'all';
const DEFAULT_SORT: ContactSort = 'newest';

export function useListParams() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const params: ListParams = {
    query: searchParams.get('q') ?? '',
    view: listViewSchema.catch(DEFAULT_VIEW).parse(searchParams.get('view')),
    sort: contactSortSchema.catch(DEFAULT_SORT).parse(searchParams.get('sort')),
  };

  function setParams(changes: Partial<ListParams>) {
    const next = { ...params, ...changes };
    const search = new URLSearchParams();
    if (next.query !== '') search.set('q', next.query);
    if (next.view !== DEFAULT_VIEW) search.set('view', next.view);
    if (next.sort !== DEFAULT_SORT) search.set('sort', next.sort);

    const queryString = search.toString();
    router.replace(queryString ? `/contacts?${queryString}` : '/contacts', { scroll: false });
  }

  return { ...params, setParams };
}
