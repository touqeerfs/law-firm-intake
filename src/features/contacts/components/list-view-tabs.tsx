import { cx } from '@/lib/cx';
import type { Status } from '../contact-model';
import { listViews, type ListView } from '../contact-rules';

export type ListViewTab = {
  view: ListView;
  count: number;
};

type ListViewTabsProps = {
  tabs: ListViewTab[];
  currentView: ListView;
  onViewChange: (view: ListView) => void;
};

const statusDotClasses: Record<Status, string> = {
  lead: 'bg-lead',
  active: 'bg-active',
  closed: 'bg-closed',
};

export function ListViewTabs({ tabs, currentView, onViewChange }: ListViewTabsProps) {
  return (
    <div
      role="group"
      aria-label="Views"
      className="mb-3.5 flex no-scrollbar gap-0.5 overflow-x-auto border-b border-border"
    >
      {tabs.map(({ view, count }) => {
        const { label, status, needsAttention } = listViews[view];
        return (
          <button
            key={view}
            type="button"
            aria-pressed={view === currentView}
            onClick={() => onViewChange(view)}
            className="relative inline-flex h-9.5 shrink-0 items-center gap-1.75 px-2.5 font-semibold whitespace-nowrap text-muted transition-colors hover:text-text aria-pressed:text-text aria-pressed:after:absolute aria-pressed:after:inset-x-2 aria-pressed:after:-bottom-px aria-pressed:after:h-0.5 aria-pressed:after:rounded-full aria-pressed:after:bg-text"
          >
            {status && (
              <span
                aria-hidden
                className={cx('size-1.75 rounded-full', statusDotClasses[status])}
              />
            )}
            {label}
            <span
              className={cx(
                'inline-grid h-4.5 min-w-5 place-items-center rounded-xs px-1.5 text-xs font-semibold tabular-nums',
                needsAttention && count > 0 ? 'bg-warn-bg text-warn-fg' : 'bg-surface-3 text-muted',
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
