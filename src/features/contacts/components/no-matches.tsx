import Link from 'next/link';
import { Check, Plus, Search } from 'lucide-react';
import { Button, buttonClasses } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { listViews, type ListView } from '../contact-rules';

type NoSearchMatchesProps = {
  query: string;
  onClearFilters: () => void;
};

type EmptyViewProps = {
  view: ListView;
  onClearFilters: () => void;
};

const emptyViewTitles: Record<ListView, string> = {
  all: 'Nobody on the intake list yet',
  due: 'No follow-ups due',
  'not-contacted': 'Everyone has been contacted',
  lead: 'Nothing in Lead',
  active: 'Nothing in Active',
  closed: 'Nothing in Closed',
};

export function NoSearchMatches({ query, onClearFilters }: NoSearchMatchesProps) {
  return (
    <EmptyState
      icon={Search}
      title={`No one matches “${query}”`}
      action={
        <>
          <Button onClick={onClearFilters}>Clear filters</Button>
          <Link
            href={`/contacts/new?name=${encodeURIComponent(query)}`}
            className={buttonClasses({ variant: 'primary' })}
          >
            <Plus className="size-3.75" aria-hidden />
            Log “{query}” as an inquiry
          </Link>
        </>
      }
    >
      Check the spelling, try the last four digits of their phone number, or clear the filters.
    </EmptyState>
  );
}

export function EmptyView({ view, onClearFilters }: EmptyViewProps) {
  return (
    <EmptyState
      icon={Check}
      title={emptyViewTitles[view]}
      action={<Button onClick={onClearFilters}>Clear filters</Button>}
    >
      {listViews[view].needsAttention
        ? 'Nothing needs attention here right now.'
        : 'Try another view, or clear the filters to see everyone.'}
    </EmptyState>
  );
}
