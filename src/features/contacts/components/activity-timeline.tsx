import { formatDayHeading } from '@/lib/dates';
import type { Activity, Contact } from '../contact-model';
import { TimelineItem, type PendingEntry } from './timeline-item';

type ActivityTimelineProps = {
  contact: Contact;
  activities: Activity[];
  pending: PendingEntry | null;
};

type DayGroup = {
  label: string;
  activities: Activity[];
};

function groupByDay(activities: Activity[]): DayGroup[] {
  const groups: DayGroup[] = [];
  for (const activity of activities) {
    const label = formatDayHeading(activity.at);
    const lastGroup = groups.at(-1);
    if (lastGroup?.label === label) lastGroup.activities.push(activity);
    else groups.push({ label, activities: [activity] });
  }
  return groups;
}

export function ActivityTimeline({ contact, activities, pending }: ActivityTimelineProps) {
  const all = pending ? [pending.activity, ...activities] : activities;

  if (all.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border p-5.5 text-center text-sm text-muted">
        No activity yet. Calls, notes and status changes are recorded here automatically.
      </p>
    );
  }

  return groupByDay(all).map((group) => (
    <div key={group.label}>
      <h3 className="flex items-center gap-2.5 pt-3.5 pb-2 text-2xs font-semibold tracking-wider text-muted uppercase after:h-px after:flex-1 after:bg-border">
        {group.label}
      </h3>
      <ol>
        {group.activities.map((activity, index) => (
          <TimelineItem
            key={activity.id}
            activity={activity}
            contact={contact}
            pending={activity === pending?.activity ? pending : null}
            isLast={index === group.activities.length - 1}
          />
        ))}
      </ol>
    </div>
  ));
}
