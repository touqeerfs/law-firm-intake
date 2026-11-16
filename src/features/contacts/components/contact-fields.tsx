import type { ReactNode } from 'react';
import { Clock, Flag, Shield, ShieldCheck, User, type LucideIcon } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Meter } from '@/components/ui/meter';
import { Pill, type PillTone } from '@/components/ui/pill';
import { Tag, type TagTone } from '@/components/ui/tag';
import { cx } from '@/lib/cx';
import { formatRelative, formatShortDate, formatTime } from '@/lib/dates';
import {
  attorneys,
  closeReasons,
  statusDetails,
  type AttorneyId,
  type CloseReason,
  type ConflictCheck,
  type Contact,
  type Outcome,
  type Status,
} from '../contact-model';
import {
  followUpLabel,
  STATUS_STALLED_DAYS,
  timeInStatus,
  type TimeInStatusTone,
} from '../contact-rules';

type ContactProps = {
  contact: Contact;
};

const outcomeTones: Record<Outcome, PillTone> = { won: 'won', lost: 'lost', declined: 'closed' };

export const statusDotClasses: Record<Status, string> = {
  lead: 'bg-lead',
  active: 'bg-active',
  closed: 'bg-closed',
};

type StatusPillProps = {
  status: Status;
};

export function StatusPill({ status }: StatusPillProps) {
  return <Pill tone={status}>{statusDetails[status].label}</Pill>;
}

export function ContactStatusPill({ contact }: ContactProps) {
  if (contact.status !== 'closed' || contact.closeReason === null) {
    return <StatusPill status={contact.status} />;
  }

  return <OutcomePill closeReason={contact.closeReason} short />;
}

type OutcomePillProps = {
  closeReason: CloseReason;
  short?: boolean;
};

export function OutcomePill({ closeReason, short = false }: OutcomePillProps) {
  const reason = closeReasons[closeReason];
  return (
    <Pill tone={outcomeTones[reason.outcome]} title={`Closed · ${reason.label}`}>
      {short ? reason.shortLabel : reason.label}
    </Pill>
  );
}

export const conflictCheckTags: Record<
  ConflictCheck,
  { label: string; tone: TagTone; icon: LucideIcon }
> = {
  pending: { label: 'Check pending', tone: 'warn', icon: Shield },
  cleared: { label: 'Cleared', tone: 'ok', icon: ShieldCheck },
  flagged: { label: 'Possible conflict', tone: 'danger', icon: Flag },
};

type ConflictCheckTagProps = {
  conflictCheck: ConflictCheck;
};

export function ConflictCheckTag({ conflictCheck }: ConflictCheckTagProps) {
  const { label, tone, icon } = conflictCheckTags[conflictCheck];
  return (
    <Tag tone={tone} icon={icon}>
      {label}
    </Tag>
  );
}

type FollowUpTagProps = ContactProps & {
  fallback?: ReactNode;
};

export function FollowUpTag({ contact, fallback = null }: FollowUpTagProps) {
  const followUp = followUpLabel(contact);
  if (!followUp) return fallback;
  return (
    <Tag tone={followUp.tone} icon={Clock}>
      {followUp.label}
    </Tag>
  );
}

export function NoValue() {
  return <span className="text-faint">—</span>;
}

export function ConflictFlag() {
  return (
    <span title="Possible conflict" className="shrink-0 text-danger-fg">
      <Flag className="size-3.25" aria-hidden />
      <span className="sr-only">Possible conflict</span>
    </span>
  );
}

export function NotContactedTag() {
  return <Tag tone="warn">Not contacted</Tag>;
}

const timeInStatusText: Record<TimeInStatusTone, string> = {
  neutral: 'text-muted',
  ok: 'text-muted',
  warn: 'text-warn-fg',
  danger: 'text-danger-fg',
};

type TimeInStatusProps = ContactProps & {
  showLabel?: boolean;
};

export function TimeInStatus({ contact, showLabel = false }: TimeInStatusProps) {
  const { days, tone } = timeInStatus(contact);
  const status = statusDetails[contact.status].label;
  const label = days === 0 ? 'New today' : `${days}d in ${status}`;

  return (
    <span
      title={label}
      className={cx(
        'inline-flex items-center gap-1.75 text-xs font-semibold tabular-nums',
        timeInStatusText[tone],
      )}
    >
      <Meter value={days} max={STATUS_STALLED_DAYS} tone={tone} />
      {showLabel ? (
        label
      ) : (
        <>
          {days}d<span className="sr-only"> in {status}</span>
        </>
      )}
    </span>
  );
}

type AttorneyNameProps = {
  attorneyId: AttorneyId | null;
};

export function AttorneyName({ attorneyId }: AttorneyNameProps) {
  if (attorneyId === null) {
    return (
      <span className="inline-flex items-center gap-2 text-faint">
        <span className="grid size-5 shrink-0 place-items-center rounded-full border border-dashed border-border-strong">
          <User className="size-2.75" aria-hidden />
        </span>
        Unassigned
      </span>
    );
  }

  const attorney = attorneys[attorneyId];
  return (
    <span title={attorney.name} className="inline-flex items-center gap-2 font-medium text-text-2">
      <Avatar name={attorney.name} size="xs" />
      {attorney.shortName}
    </span>
  );
}

type RelativeTimeProps = {
  iso: string;
};

export function RelativeTime({ iso }: RelativeTimeProps) {
  return (
    <time dateTime={iso} title={`${formatShortDate(iso)}, ${formatTime(iso)}`}>
      {formatRelative(iso)}
    </time>
  );
}
