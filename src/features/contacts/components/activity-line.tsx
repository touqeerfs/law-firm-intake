import { ArrowRight } from 'lucide-react';
import { contactFieldLabels, type Activity, type Contact } from '../contact-model';
import { OutcomePill, StatusPill } from './contact-fields';

type ActivityLineProps = {
  activity: Activity;
  contact: Contact;
};

export function ActivityLine({ activity, contact }: ActivityLineProps) {
  const actor = <strong className="font-semibold text-text">{activity.actor}</strong>;

  switch (activity.type) {
    case 'created':
      return (
        <>
          Inquiry received via <strong className="font-semibold text-text">{contact.source}</strong>
          {activity.actor !== 'Web intake' && ` · logged by ${activity.actor}`}
        </>
      );
    case 'call':
      return <>{actor} logged a call</>;
    case 'email':
      return <>{actor} logged an email</>;
    case 'note':
      return <>{actor} added a note</>;
    case 'consultation':
      return <>{actor} booked a consultation</>;
    case 'conflict_check':
      return activity.flagged ? (
        <>
          {actor} flagged a{' '}
          <strong className="font-semibold text-danger-fg">possible conflict</strong>
        </>
      ) : (
        <>{actor} cleared the conflict check</>
      );
    case 'status_change':
      return (
        <>
          {actor} moved
          {activity.from && <StatusPill status={activity.from} />}
          <ArrowRight className="size-3.25 text-muted" aria-label="to" />
          {activity.to && <StatusPill status={activity.to} />}
          {activity.closeReason && <OutcomePill closeReason={activity.closeReason} />}
        </>
      );
    case 'edit':
      return (
        <>
          {actor} updated{' '}
          {(activity.changedFields ?? [])
            .map((field) => contactFieldLabels[field] ?? field)
            .join(', ')}
        </>
      );
  }
}
