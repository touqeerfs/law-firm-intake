import { useId } from 'react';
import { toast } from 'sonner';
import { firstName } from '@/lib/text';
import { COORDINATOR, type Activity, type ActivityEntry, type Contact } from '../contact-model';
import { useContactMutations } from '../use-contact-mutations';
import { ActivityComposer, composerTypes } from './activity-composer';
import { ActivityTimeline } from './activity-timeline';
import type { PendingEntry } from './timeline-item';

type ActivitySectionProps = {
  contact: Contact;
  activities: Activity[];
  onDraftChange?: (hasDraft: boolean) => void;
};

export function ActivitySection({ contact, activities, onDraftChange }: ActivitySectionProps) {
  const { addActivity } = useContactMutations();
  const headingId = useId();

  function save(entry: ActivityEntry) {
    addActivity.mutate(
      { contactId: contact.id, ...entry },
      {
        onSuccess: () =>
          toast.success(
            `${composerTypes[entry.type].label} saved to ${firstName(contact.name)}'s timeline`,
          ),
      },
    );
  }

  const { variables } = addActivity;
  const pending: PendingEntry | null =
    variables && (addActivity.isPending || addActivity.isError)
      ? {
          activity: {
            id: 'pending',
            contactId: variables.contactId,
            at: new Date(addActivity.submittedAt).toISOString(),
            actor: COORDINATOR,
            type: variables.type,
            body: variables.body,
          },
          isFailed: addActivity.isError,
          onRetry: () => save(variables),
          onDiscard: addActivity.reset,
        }
      : null;

  return (
    <section aria-labelledby={headingId} className="min-w-0 flex-1">
      <ActivityComposer status={addActivity.status} onSave={save} onDraftChange={onDraftChange} />
      <div className="mb-1.5 flex items-center justify-between">
        <h2 id={headingId} className="font-semibold">
          Activity
        </h2>
        <span className="grid h-4.5 min-w-5 place-items-center rounded-xs bg-surface-3 px-1.5 text-xs font-semibold text-muted tabular-nums">
          {activities.length + (pending ? 1 : 0)}
        </span>
      </div>
      <ActivityTimeline contact={contact} activities={activities} pending={pending} />
    </section>
  );
}
