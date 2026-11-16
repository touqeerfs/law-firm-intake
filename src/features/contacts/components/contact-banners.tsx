import { Flag, Folder } from 'lucide-react';
import { Banner } from '@/components/ui/banner';
import { formatRelative } from '@/lib/dates';
import { closeReasons, type Contact } from '../contact-model';

type ContactBannersProps = {
  contact: Contact;
};

export function ContactBanners({ contact }: ContactBannersProps) {
  const reason =
    contact.status === 'closed' && contact.closeReason ? closeReasons[contact.closeReason] : null;

  if (contact.conflictCheck !== 'flagged' && !reason) return null;

  return (
    <div className="mb-4 flex flex-col gap-2.5">
      {contact.conflictCheck === 'flagged' && (
        <Banner tone="danger" icon={Flag} title="Possible conflict of interest">
          Hold intake and don&apos;t discuss case details until an attorney reviews the conflict
          note below.
        </Banner>
      )}
      {reason && (
        <Banner tone="neutral" icon={Folder} title={`Closed · ${reason.label}`}>
          {reason.hint}. Closed {formatRelative(contact.statusChangedAt)}. Move back to Lead if they
          get in touch again.
        </Banner>
      )}
    </div>
  );
}
