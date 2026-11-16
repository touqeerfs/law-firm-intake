import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { Mail, PenLine, Phone, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Kbd } from '@/components/ui/kbd';
import type { ActivityEntry } from '../contact-model';

type EntryType = ActivityEntry['type'];

type ActivityComposerProps = {
  status: 'idle' | 'pending' | 'error' | 'success';
  onSave: (entry: ActivityEntry) => void;
};

export const composerTypes: Record<
  EntryType,
  { label: string; icon: LucideIcon; action: string; placeholder: string }
> = {
  note: {
    label: 'Note',
    icon: PenLine,
    action: 'Add note',
    placeholder:
      'Add context the team should know: what they need, documents promised, next steps.',
  },
  call: {
    label: 'Call',
    icon: Phone,
    action: 'Log call',
    placeholder: 'Who did you speak to, what was agreed, and when is the next call?',
  },
  email: {
    label: 'Email',
    icon: Mail,
    action: 'Log email',
    placeholder: 'Summarise what was sent or received.',
  },
};

const entryTypes: EntryType[] = ['note', 'call', 'email'];

export function ActivityComposer({ status, onSave }: ActivityComposerProps) {
  const [type, setType] = useState<EntryType>('note');
  const [body, setBody] = useState('');
  const [showError, setShowError] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const textareaId = useId();
  const errorId = useId();
  const isBlocked = status === 'pending' || status === 'error';

  function save() {
    if (isBlocked) return;
    const trimmed = body.trim();
    if (!trimmed) {
      setShowError(true);
      textareaRef.current?.focus();
      return;
    }
    onSave({ type, body: trimmed });
    setBody('');
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      save();
    }
  }

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        save();
      }}
      className="mb-4.5 rounded-lg border border-border bg-surface shadow-xs transition-colors focus-within:border-accent focus-within:ring-3 focus-within:ring-accent/30"
    >
      <fieldset className="flex gap-1 px-2 pt-2">
        <legend className="sr-only">Activity type</legend>
        {entryTypes.map((entryType) => {
          const { label, icon: Icon } = composerTypes[entryType];
          return (
            <label key={entryType}>
              <input
                type="radio"
                name={`${textareaId}-type`}
                value={entryType}
                checked={type === entryType}
                onChange={() => setType(entryType)}
                className="peer sr-only"
              />
              <span className="flex h-7 cursor-pointer items-center gap-1.5 rounded-sm px-2.5 text-sm font-semibold text-muted transition-colors peer-checked:bg-surface-3 peer-checked:text-text peer-focus-visible:outline-3 peer-focus-visible:outline-accent/30 hover:text-text">
                <Icon className="size-3.5" aria-hidden />
                {label}
              </span>
            </label>
          );
        })}
      </fieldset>

      <label htmlFor={textareaId} className="sr-only">
        {composerTypes[type].label}
      </label>
      <textarea
        ref={textareaRef}
        id={textareaId}
        value={body}
        onChange={(event) => {
          setBody(event.target.value);
          setShowError(false);
        }}
        onKeyDown={handleKeyDown}
        placeholder={composerTypes[type].placeholder}
        aria-invalid={showError}
        aria-describedby={showError ? errorId : undefined}
        className="block min-h-18 w-full resize-y bg-transparent px-3.5 py-2 leading-5 placeholder:text-faint focus-visible:outline-none"
      />
      {showError && (
        <p id={errorId} className="px-3.5 pb-1.5 text-sm text-danger-fg">
          Write something before saving.
        </p>
      )}

      <div className="flex items-center justify-between gap-2 py-2 pr-2 pl-3.5">
        {status === 'error' ? (
          <p className="text-xs text-danger-fg">
            Retry or discard the entry that didn&apos;t save.
          </p>
        ) : (
          <p className="flex items-center gap-1 text-xs text-faint">
            <Kbd>⌘</Kbd>
            <Kbd>↵</Kbd>
            to save
          </p>
        )}
        <Button type="submit" variant="primary" size="sm" disabled={isBlocked}>
          {composerTypes[type].action}
        </Button>
      </div>
    </form>
  );
}
