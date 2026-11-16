import { CircleAlert, RefreshCw, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Banner } from '@/components/ui/banner';
import { RepositoryError } from '../repository-error';

type ContactsLoadErrorProps = {
  title: string;
  error: Error;
  isRetrying: boolean;
  onRetry: () => void;
  onReset: () => void;
};

export function ContactsLoadError({
  title,
  error,
  isRetrying,
  onRetry,
  onReset,
}: ContactsLoadErrorProps) {
  const code = error instanceof RepositoryError ? error.code : null;

  if (code === 'corrupt') {
    return (
      <Banner
        tone="danger"
        role="alert"
        icon={CircleAlert}
        title="We couldn't read the data saved in this browser."
        action={
          <Button size="sm" onClick={onReset}>
            Reset sample data
          </Button>
        }
      >
        It may have been edited by hand or saved by an older version. Resetting restores the sample
        intake list.
      </Banner>
    );
  }

  return (
    <Banner
      tone="danger"
      role="alert"
      icon={code === 'network' ? WifiOff : CircleAlert}
      title={title}
      action={
        <Button size="sm" onClick={onRetry} disabled={isRetrying}>
          <RefreshCw className="size-3.5" aria-hidden />
          {isRetrying ? 'Trying again…' : 'Try again'}
        </Button>
      }
    >
      {error.message} Nothing you&apos;ve saved has been lost.
    </Banner>
  );
}
