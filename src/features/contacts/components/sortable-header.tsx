import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cx } from '@/lib/cx';
import type { ContactSort } from '../contact-rules';

type SortableHeaderProps = {
  sort: ContactSort;
  direction: 'ascending' | 'descending';
  currentSort: ContactSort;
  onSortChange: (sort: ContactSort) => void;
  className: string;
  children: ReactNode;
};

export function SortableHeader({
  sort,
  direction,
  currentSort,
  onSortChange,
  className,
  children,
}: SortableHeaderProps) {
  const isCurrent = sort === currentSort;

  return (
    <th aria-sort={isCurrent ? direction : undefined} className={className}>
      <button
        type="button"
        onClick={() => onSortChange(sort)}
        className={cx(
          'group inline-flex h-6 items-center gap-1 font-semibold hover:text-text',
          isCurrent && 'text-text',
        )}
      >
        {children}
        <ChevronDown
          aria-hidden
          className={cx(
            'size-3 transition-opacity',
            isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-50',
          )}
        />
      </button>
    </th>
  );
}
