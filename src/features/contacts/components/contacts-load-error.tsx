import { CircleAlert, RefreshCw, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ErrorBanner } from '@/components/ui/error-banner';
import { RepositoryError } from '../repository-error';
import { useDemoControls } from '../use-demo-controls';

type ContactsLoadErrorProps = {
  error: Error;
  isRetrying: boolean;
  onRetry: () => void;
};

export function ContactsLoadError({ error, isRetrying, onRetry }: ContactsLoadErrorProps) {
  const { changeData } = useDemoControls();
  const code = error instanceof RepositoryError ? error.code : null;

  if (code === 'corrupt') {
    return (
      <ErrorBanner
        icon={CircleAlert}
        title="We couldn't read the data saved in this browser."
        action={
          <Button size="sm" onClick={() => changeData('sample')}>
            Reset sample data
          </Button>
        }
      >
        It may have been edited by hand or saved by an older version. Resetting restores the sample
        intake list.
      </ErrorBanner>
    );
  }

  return (
    <ErrorBanner
      icon={code === 'network' ? WifiOff : CircleAlert}
      title="Couldn't load contacts."
      action={
        <Button size="sm" onClick={onRetry} disabled={isRetrying}>
          <RefreshCw className="size-3.5" aria-hidden />
          {isRetrying ? 'Trying again…' : 'Try again'}
        </Button>
      }
    >
      {error.message} Nothing you&apos;ve saved has been lost.
    </ErrorBanner>
  );
}
