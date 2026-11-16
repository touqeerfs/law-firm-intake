import { useEffect, useRef } from 'react';
import { CircleAlert, RefreshCw, WifiOff } from 'lucide-react';
import { Banner } from '@/components/ui/banner';
import { Button } from '@/components/ui/button';
import { RepositoryError } from '../repository-error';

type SaveErrorBannerProps = {
  error: Error;
};

export function SaveErrorBanner({ error }: SaveErrorBannerProps) {
  const bannerRef = useRef<HTMLDivElement>(null);
  const isNetworkError = error instanceof RepositoryError && error.code === 'network';

  useEffect(() => {
    bannerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  return (
    <div ref={bannerRef} className="mb-3.5">
      <Banner
        tone="danger"
        role="alert"
        icon={isNetworkError ? WifiOff : CircleAlert}
        title="Couldn't save this inquiry."
        action={
          <Button type="submit" size="sm">
            <RefreshCw className="size-3.5" aria-hidden />
            Try again
          </Button>
        }
      >
        {error.message} Your changes are still here.
      </Banner>
    </div>
  );
}
