import { Check, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Kbd } from '@/components/ui/kbd';

type FormFooterProps = {
  isDirty: boolean;
  isSaving: boolean;
  submitLabel: string;
  onCancel: () => void;
};

const buttonWidth = 'flex-1 desktop:flex-none';

export function FormFooter({ isDirty, isSaving, submitLabel, onCancel }: FormFooterProps) {
  return (
    <div className="fixed inset-x-2 bottom-above-tab-bar z-20 mt-1.5 flex items-center gap-2.5 rounded-lg border border-border bg-surface/88 p-2.5 shadow-md backdrop-blur-md desktop:sticky desktop:bottom-2 desktop:pl-4">
      <p className="mr-auto hidden items-center gap-1 text-sm text-muted desktop:flex">
        {isDirty ? (
          <>
            <span aria-hidden className="mr-1 size-1.75 rounded-full bg-warn" />
            Unsaved changes
          </>
        ) : (
          <>
            <Kbd>⌘</Kbd>
            <Kbd>↵</Kbd>
            <span className="text-muted">to save</span>
          </>
        )}
      </p>
      <Button variant="ghost" onClick={onCancel} className={buttonWidth}>
        Cancel
      </Button>
      <Button type="submit" variant="primary" disabled={isSaving} className={buttonWidth}>
        {isSaving ? (
          <>
            <LoaderCircle className="size-3.75 animate-spin" aria-hidden />
            Saving…
          </>
        ) : (
          <>
            <Check className="size-3.75" aria-hidden />
            {submitLabel}
          </>
        )}
      </Button>
    </div>
  );
}
