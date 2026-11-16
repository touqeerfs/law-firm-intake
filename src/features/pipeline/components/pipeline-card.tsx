import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useDraggable } from '@dnd-kit/core';
import { PenLine, Phone } from 'lucide-react';
import { buttonClasses } from '@/components/ui/button';
import type { Contact, Status } from '@/features/contacts/contact-model';
import { phoneHref } from '@/features/contacts/contact-rules';
import { cx } from '@/lib/cx';
import { CardFace, cardClasses, nameClasses } from './card-face';
import { CardMenu } from './card-menu';

type PipelineCardProps = {
  contact: Contact;
  isSaving: boolean;
  isLanded: boolean;
  onMove: (contact: Contact, to: Status) => void;
};

const actionClasses = cx(
  buttonClasses({ variant: 'ghost', size: 'sm', iconOnly: true }),
  'max-desktop:hidden',
);

export function PipelineCard({ contact, isSaving, isLanded, onMove }: PipelineCardProps) {
  const { setNodeRef, setActivatorNodeRef, node, listeners, attributes, isDragging } = useDraggable(
    { id: contact.id },
  );
  const nameRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!isLanded) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    node.current?.scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' });
    // The card remounts in its new column, so focus that was on the old copy falls back to the page
    if (document.activeElement === document.body) nameRef.current?.focus({ preventScroll: true });
  }, [isLanded, node]);

  return (
    <article
      ref={setNodeRef}
      {...listeners}
      aria-busy={isSaving}
      className={cx(
        cardClasses(contact),
        'group shadow-xs transition hover:-translate-y-px hover:border-border-strong hover:shadow-md motion-reduce:transition-none',
        isDragging && 'scale-98 opacity-40',
        isLanded && 'motion-safe:animate-landed',
      )}
    >
      {isSaving && (
        <span aria-hidden className="absolute inset-x-3 top-0 h-0.5 saving-shimmer rounded-full" />
      )}

      <CardFace
        contact={contact}
        name={
          <Link
            ref={(link) => {
              nameRef.current = link;
              setActivatorNodeRef(link);
            }}
            href={`/contacts/${contact.id}`}
            aria-describedby={attributes['aria-describedby']}
            className={cx(nameClasses, 'after:absolute after:inset-0 after:rounded-md')}
          >
            {contact.name}
          </Link>
        }
      />

      <div className="absolute top-1.5 right-1.5 z-10 flex gap-0.5 rounded-sm desktop:top-2 desktop:right-2 desktop:border desktop:border-border desktop:bg-surface desktop:p-0.5 desktop:opacity-0 desktop:shadow-md desktop:transition-opacity desktop:group-focus-within:opacity-100 desktop:group-hover:opacity-100 desktop:has-aria-expanded:opacity-100">
        {contact.phone && (
          <a
            href={phoneHref(contact.phone)}
            aria-label={`Call ${contact.name}`}
            className={actionClasses}
          >
            <Phone className="size-3.5" aria-hidden />
          </a>
        )}
        <Link
          href={`/contacts/${contact.id}`}
          aria-label={`Log a note for ${contact.name}`}
          className={actionClasses}
        >
          <PenLine className="size-3.5" aria-hidden />
        </Link>
        <CardMenu contact={contact} onMove={onMove} />
      </div>
    </article>
  );
}
