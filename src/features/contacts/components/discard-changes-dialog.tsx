import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';

type DiscardChangesDialogProps = {
  onKeepEditing: () => void;
  onDiscard: () => void;
};

export function DiscardChangesDialog({ onKeepEditing, onDiscard }: DiscardChangesDialogProps) {
  return (
    <Dialog
      title="Discard unsaved changes?"
      description="You have edits that haven't been saved. If you leave now they will be lost."
      onClose={onKeepEditing}
    >
      <div className="flex justify-end gap-2 px-5.5 pt-4 pb-4.5">
        <Button onClick={onKeepEditing}>Keep editing</Button>
        <Button variant="danger" onClick={onDiscard}>
          Discard changes
        </Button>
      </div>
    </Dialog>
  );
}
