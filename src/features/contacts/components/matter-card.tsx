import { CalendarDays, Clock, Inbox, User } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Fact } from '@/components/ui/fact';
import { formatShortDate } from '@/lib/dates';
import { attorneys, type Contact } from '../contact-model';
import { followUpLabel, type FollowUpTone } from '../contact-rules';
import { conflictCheckTags, ConflictCheckTag, TimeInStatus } from './contact-fields';

type MatterCardProps = {
  contact: Contact;
};

const followUpText: Record<FollowUpTone, string> = {
  neutral: 'text-text',
  warn: 'text-warn-fg',
  danger: 'text-danger-fg',
};

function NextFollowUp({ contact }: MatterCardProps) {
  if (contact.status === 'closed') return <span className="text-muted">Not needed</span>;

  const followUp = followUpLabel(contact);
  if (!followUp || !contact.followUpAt) return <span className="text-muted">Not scheduled</span>;

  return (
    <span>
      <span className={followUpText[followUp.tone]}>{followUp.label}</span>
      <span className="text-muted"> · {formatShortDate(contact.followUpAt)}</span>
    </span>
  );
}

export function MatterCard({ contact }: MatterCardProps) {
  const attorney = contact.attorneyId ? attorneys[contact.attorneyId] : null;

  return (
    <Card title="Matter">
      <p className="leading-5.5">{contact.summary}</p>
      <dl className="mt-3">
        <Fact icon={User} label="Attorney">
          {attorney ? (
            <span className="inline-flex items-center gap-2">
              <Avatar name={attorney.name} size="xs" />
              {attorney.name}
            </span>
          ) : (
            <span className="text-muted">Unassigned</span>
          )}
        </Fact>
        <Fact icon={CalendarDays} label="Next follow-up">
          <NextFollowUp contact={contact} />
        </Fact>
        <Fact icon={Inbox} label="Source">
          <span>
            {contact.source}
            {contact.referredBy && <span className="text-muted"> · {contact.referredBy}</span>}
          </span>
        </Fact>
        <Fact icon={conflictCheckTags[contact.conflictCheck].icon} label="Conflict check">
          <ConflictCheckTag conflictCheck={contact.conflictCheck} />
        </Fact>
        <Fact icon={Clock} label="Time in status">
          <TimeInStatus contact={contact} showLabel />
        </Fact>
      </dl>
    </Card>
  );
}
