import { Award, Clock, PhoneIncoming, Timer } from 'lucide-react';
import type { Activity, Contact } from '@/features/contacts/contact-model';
import { useActivities } from '@/features/contacts/use-contacts';
import { formatDuration } from '@/lib/dates';
import type { BoardFocus } from '../board-focus';
import { boardMetrics, FIRST_RESPONSE_TARGET_MS } from '../board-metrics';
import { OutcomeBar, TargetBar } from './insight-bars';
import { InsightTile, InsightTileSkeleton } from './insight-tile';

type InsightsStripProps = {
  contacts: Contact[] | undefined;
  focus: BoardFocus | null;
  onFocusChange: (focus: BoardFocus | null) => void;
};

type InsightTilesProps = Omit<InsightsStripProps, 'contacts'> & {
  contacts: Contact[];
  activities: Activity[];
};

function InsightTiles({ contacts, activities, focus, onFocusChange }: InsightTilesProps) {
  const metrics = boardMetrics(contacts, activities);
  const { outcomes, withinTargetPercent, longestWaitMs, medianFirstResponseMs } = metrics;
  const toggle = (tile: BoardFocus) => onFocusChange(focus === tile ? null : tile);

  return (
    <>
      <InsightTile
        icon={Clock}
        tone="warn"
        label="Follow-ups due"
        value={metrics.dueCount}
        note={metrics.overdueCount > 0 ? `${metrics.overdueCount} overdue` : undefined}
        noteTone="danger"
        isPressed={focus === 'due'}
        onClick={() => toggle('due')}
      >
        Across {metrics.openCount} open {metrics.openCount === 1 ? 'inquiry' : 'inquiries'}
      </InsightTile>

      <InsightTile
        icon={PhoneIncoming}
        tone="accent"
        label="Awaiting first contact"
        value={metrics.notContactedCount}
        note={metrics.notContactedCount > 0 ? 'call now' : 'all reached'}
        noteTone={metrics.notContactedCount > 0 ? 'warn' : 'ok'}
        isPressed={focus === 'not-contacted'}
        onClick={() => toggle('not-contacted')}
      >
        {longestWaitMs === null
          ? 'Every new inquiry has been contacted'
          : `Oldest waiting ${formatDuration(longestWaitMs)}`}
      </InsightTile>

      <InsightTile
        icon={Timer}
        tone="active"
        label="Median first response"
        value={medianFirstResponseMs === null ? '—' : formatDuration(medianFirstResponseMs)}
        note={`target ${formatDuration(FIRST_RESPONSE_TARGET_MS)}`}
      >
        {withinTargetPercent === null ? (
          'No calls or emails logged yet'
        ) : (
          <>
            <TargetBar percent={withinTargetPercent} />
            {withinTargetPercent}% within target
          </>
        )}
      </InsightTile>

      <InsightTile
        icon={Award}
        tone="won"
        label="Retention · last 30 days"
        value={metrics.retentionPercent === null ? '—' : `${metrics.retentionPercent}%`}
        note={`${outcomes.won} of ${metrics.closedCount} closed`}
      >
        <OutcomeBar outcomes={outcomes} />
        {outcomes.lost} lost · {outcomes.declined} declined
      </InsightTile>
    </>
  );
}

export function InsightsStrip({ contacts, focus, onFocusChange }: InsightsStripProps) {
  const { data: activities, isError } = useActivities();
  if (isError) return null;

  return (
    <section
      aria-label="Pipeline insights"
      aria-busy={!contacts || !activities}
      className="mb-4 flex snap-x snap-mandatory no-scrollbar gap-px overflow-x-auto rounded-lg border border-border bg-border shadow-xs desktop:grid desktop:grid-cols-2 wide:grid-cols-4"
    >
      {contacts && activities ? (
        <InsightTiles
          contacts={contacts}
          activities={activities}
          focus={focus}
          onFocusChange={onFocusChange}
        />
      ) : (
        Array.from({ length: 4 }, (_, index) => <InsightTileSkeleton key={index} />)
      )}
    </section>
  );
}
