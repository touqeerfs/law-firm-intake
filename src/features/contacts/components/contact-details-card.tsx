import { Hash, Mail, MessageCircle, Phone, PhoneIncoming } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Fact } from '@/components/ui/fact';
import { Tag } from '@/components/ui/tag';
import { formatShortDate, formatTime } from '@/lib/dates';
import { preferredChannelLabels, type Contact } from '../contact-model';
import { phoneHref } from '../contact-rules';
import { RelativeTime } from './contact-fields';
import { CopyButton } from './copy-button';

type ContactDetailsCardProps = {
  contact: Contact;
};

type CopyableLinkProps = {
  href: string;
  value: string;
  copyLabel: string;
};

function CopyableLink({ href, value, copyLabel }: CopyableLinkProps) {
  return (
    <span className="flex min-w-0 items-center gap-1">
      <a
        href={href}
        className="flex min-h-11 min-w-0 items-center text-accent-text underline-offset-3 hover:underline desktop:min-h-0"
      >
        {value}
      </a>
      <CopyButton value={value} label={copyLabel} />
    </span>
  );
}

function NotProvided() {
  return <span className="text-muted">Not provided</span>;
}

export function ContactDetailsCard({ contact }: ContactDetailsCardProps) {
  return (
    <Card title="Contact">
      <dl>
        <Fact icon={Phone} label="Phone">
          {contact.phone ? (
            <CopyableLink
              href={phoneHref(contact.phone)}
              value={contact.phone}
              copyLabel="Phone number"
            />
          ) : (
            <NotProvided />
          )}
        </Fact>
        <Fact icon={Mail} label="Email">
          {contact.email ? (
            <CopyableLink
              href={`mailto:${contact.email}`}
              value={contact.email}
              copyLabel="Email"
            />
          ) : (
            <NotProvided />
          )}
        </Fact>
        <Fact icon={MessageCircle} label="Prefers">
          {preferredChannelLabels[contact.preferredChannel]}
        </Fact>
        <Fact icon={PhoneIncoming} label="Last contacted">
          {contact.lastContactedAt ? (
            <RelativeTime iso={contact.lastContactedAt} />
          ) : (
            <Tag tone="warn">Not contacted yet</Tag>
          )}
        </Fact>
        <Fact icon={Hash} label="Added">
          <span>
            {formatShortDate(contact.createdAt)}
            <span className="text-muted"> · {formatTime(contact.createdAt)}</span>
          </span>
        </Fact>
      </dl>
    </Card>
  );
}
