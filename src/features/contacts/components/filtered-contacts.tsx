'use client';

import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import type { Contact } from '../contact-model';
import { listViewSchema, listViews, matchesSearch, sortContacts } from '../contact-rules';
import { useListParams } from '../use-list-params';
import { ContactCards } from './contact-cards';
import { ContactsTable } from './contacts-table';
import { ListViewTabs } from './list-view-tabs';
import { NoMatches } from './no-matches';
import { SearchBox } from './search-box';
import { SortMenu } from './sort-menu';

type FilteredContactsProps = {
  contacts: Contact[];
};

export function FilteredContacts({ contacts }: FilteredContactsProps) {
  const { query, view, sort, setParams } = useListParams();

  const searched = useMemo(
    () => contacts.filter((contact) => matchesSearch(contact, query)),
    [contacts, query],
  );
  const tabs = useMemo(
    () =>
      listViewSchema.options.map((tabView) => ({
        view: tabView,
        count: searched.filter(listViews[tabView].matches).length,
      })),
    [searched],
  );
  const visible = useMemo(
    () => sortContacts(searched.filter(listViews[view].matches), sort),
    [searched, view, sort],
  );

  const isFiltered = query !== '' || view !== 'all';
  const clearFilters = () => setParams({ query: '', view: 'all' });

  return (
    <>
      <ListViewTabs
        tabs={tabs}
        currentView={view}
        onViewChange={(nextView) => setParams({ view: nextView })}
      />
      <div className="mb-3.5 flex flex-wrap items-center gap-2">
        <SearchBox query={query} onQueryChange={(nextQuery) => setParams({ query: nextQuery })} />
        <div className="ml-auto">
          <SortMenu sort={sort} onSortChange={(nextSort) => setParams({ sort: nextSort })} />
        </div>
      </div>

      {visible.length === 0 ? (
        <NoMatches query={query} view={view} onClearFilters={clearFilters} />
      ) : (
        <>
          <div className="mb-2 flex min-h-7.5 items-center justify-between gap-2 text-sm text-muted">
            <p>
              Showing <b className="font-semibold text-text tabular-nums">{visible.length}</b> of{' '}
              {contacts.length}
            </p>
            {isFiltered && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </div>
          <ContactsTable
            contacts={visible}
            query={query}
            sort={sort}
            onSortChange={(nextSort) => setParams({ sort: nextSort })}
          />
          <ContactCards contacts={visible} query={query} />
        </>
      )}
    </>
  );
}
