import { useEffect, useId, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { CircleAlert } from 'lucide-react';
import {
  PHONE_OR_EMAIL_MESSAGE,
  type ContactFormField,
  type ContactFormInput,
} from '../contact-form-schema';

const summaryFields: Array<[ContactFormField, string]> = [
  ['name', 'Full name'],
  ['phone', 'Phone'],
  ['email', 'Email'],
  ['matterType', 'Matter type'],
  ['source', 'Source'],
  ['referredBy', 'Referred by'],
  ['summary', 'Summary'],
  ['followUpDate', 'Next follow-up'],
  ['closeReason', 'Close reason'],
];

export function FormErrorSummary() {
  const {
    setFocus,
    formState: { errors, submitCount },
  } = useFormContext<ContactFormInput>();
  const summaryRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  const problems = summaryFields.flatMap(([field, label]) => {
    const message = errors[field]?.message;
    if (!message) return [];
    return [
      { field, message, label: message === PHONE_OR_EMAIL_MESSAGE ? 'Phone or email' : label },
    ];
  });

  useEffect(() => {
    summaryRef.current?.focus();
  }, [submitCount]);

  if (submitCount === 0 || problems.length === 0) return null;

  return (
    <div
      ref={summaryRef}
      role="group"
      tabIndex={-1}
      aria-labelledby={titleId}
      className="mb-3.5 rounded-md border border-danger/30 bg-danger-bg px-3.5 py-3 text-danger-fg focus:outline-none"
    >
      <p id={titleId} className="mb-1 flex items-center gap-2 font-semibold">
        <CircleAlert className="size-4" aria-hidden />
        Fix {problems.length} {problems.length === 1 ? 'field' : 'fields'} before saving
      </p>
      <ul className="list-disc pl-10">
        {problems.map(({ field, label, message }) => (
          <li key={field}>
            <a
              href={`#${field}`}
              onClick={(event) => {
                event.preventDefault();
                setFocus(field);
              }}
              className="underline underline-offset-2"
            >
              {label}: {message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
