import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

type CopyButtonProps = {
  value: string;
  label: string;
};

export function CopyButton({ value, label }: CopyButtonProps) {
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied`);
    } catch {
      toast.error("Couldn't copy. Select the text and copy it manually.");
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      iconOnly
      aria-label={`Copy ${label.toLowerCase()}`}
      onClick={copy}
      className="text-muted"
    >
      <Copy className="size-3.25" aria-hidden />
    </Button>
  );
}
