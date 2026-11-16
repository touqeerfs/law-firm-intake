import { useId, useRef, useState, type FormEvent } from 'react';
import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { firstName } from '@/lib/text';
import { closeReasons, closeReasonSchema, type CloseReason, type Contact } from '../contact-model';

type CloseReasonDialogProps = {
  contact: Contact;
  onConfirm: (closeReason: CloseReason, note: string) => void;
  onCancel: () => void;
};

export function CloseReasonDialog({ contact, onConfirm, onCancel }: CloseReasonDialogProps) {
  const [closeReason, setCloseReason] = useState<CloseReason | null>(null);
  const [note, setNote] = useState('');
  const [showError, setShowError] = useState(false);
  const firstReasonRef = useRef<HTMLInputElement>(null);
  const errorId = useId();
  const noteId = useId();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (closeReason === null) {
      setShowError(true);
      firstReasonRef.current?.focus();
      return;
    }
    onConfirm(closeReason, note.trim());
  }

  return (
    <Dialog
      title={`Close ${firstName(contact.name)}'s inquiry`}
      description="Why didn't this one move forward? Reasons feed the retention report."
      onClose={onCancel}
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="px-5.5 py-4">
          <fieldset aria-describedby={showError ? errorId : undefined}>
            <legend className="sr-only">Close reason</legend>
            <div className="grid gap-2 desktop:grid-cols-2">
              {closeReasonSchema.options.map((reason, index) => (
                <label
                  key={reason}
                  className="flex cursor-pointer items-start gap-2.5 rounded-md border border-border px-3 py-2.5 transition-colors hover:border-border-strong has-checked:border-accent has-checked:bg-accent-soft has-checked:ring-1 has-checked:ring-accent has-checked:ring-inset"
                >
                  <input
                    ref={index === 0 ? firstReasonRef : undefined}
                    type="radio"
                    name="close-reason"
                    checked={closeReason === reason}
                    onChange={() => {
                      setCloseReason(reason);
                      setShowError(false);
                    }}
                    className="mt-0.75 accent-accent"
                  />
                  <span>
                    <span className="block text-md font-semibold">
                      {closeReasons[reason].label}
                    </span>
                    <span className="block text-xs text-muted">{closeReasons[reason].hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {showError && (
            <p id={errorId} className="mt-2.5 flex items-center gap-1.5 text-sm text-danger-fg">
              <CircleAlert className="size-3.5 shrink-0" aria-hidden />
              Choose a reason to close this inquiry.
            </p>
          )}

          <label htmlFor={noteId} className="mt-3.5 mb-1.5 block text-sm font-semibold text-text-2">
            Note <span className="ml-1 font-medium text-muted">optional</span>
          </label>
          <textarea
            id={noteId}
            rows={2}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Anything the team should know if they call back"
            className="block min-h-17 w-full resize-y rounded-sm border border-border-strong bg-surface px-3 py-2.5 shadow-xs transition-colors placeholder:text-muted focus:border-accent"
          />
        </div>

        <div className="flex justify-end gap-2 px-5.5 pt-1 pb-4.5">
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="primary">
            Close inquiry
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
