import { closeReasons, type Contact, type Status } from '@/features/contacts/contact-model';
import {
  isNotContacted,
  isOverdue,
  STATUS_STALLED_DAYS,
  timeInStatus,
} from '@/features/contacts/contact-rules';

type ColumnSummaryProps = {
  status: Status;
  contacts: Contact[];
};

type Figure = {
  value: string | number;
  before?: string;
  after: string;
};

function figuresFor(status: Status, contacts: Contact[]): Figure[] {
  if (status === 'lead') {
    return [
      { value: contacts.filter(isOverdue).length, after: 'overdue' },
      { value: contacts.filter(isNotContacted).length, after: 'not contacted' },
    ];
  }

  if (status === 'active') {
    const days = contacts.map((contact) => timeInStatus(contact).days);
    const average = days.length === 0 ? 0 : days.reduce((sum, day) => sum + day, 0) / days.length;
    return [
      { before: 'avg', value: `${Math.round(average)}d`, after: 'in stage' },
      { value: days.filter((day) => day >= STATUS_STALLED_DAYS).length, after: 'stalled' },
    ];
  }

  const retained = contacts.filter(
    (contact) => contact.closeReason && closeReasons[contact.closeReason].outcome === 'won',
  ).length;
  return [
    { value: retained, after: 'retained' },
    { value: contacts.length - retained, after: 'not retained' },
  ];
}

export function ColumnSummary({ status, contacts }: ColumnSummaryProps) {
  return figuresFor(status, contacts).map(({ before, value, after }) => (
    <span key={after}>
      {before && `${before} `}
      <b className="font-semibold text-text-2">{value}</b> {after}
    </span>
  ));
}
