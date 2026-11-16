'use client';

import { useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Check, X } from 'lucide-react';
import { Toaster } from 'sonner';

type ProvidersProps = {
  children: ReactNode;
};

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, refetchOnWindowFocus: false },
    },
  });
}

const toastIcons = {
  success: <Check className="size-3.25 text-won" aria-hidden />,
  error: <X className="size-3.25 text-lost" aria-hidden />,
};

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(createQueryClient);
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="bottom-right"
        icons={toastIcons}
        mobileOffset={{ bottom: 'var(--toast-offset-mobile)' }}
        toastOptions={{
          unstyled: true,
          classNames: {
            toast:
              'flex w-full items-center gap-3 rounded-md bg-text py-2.5 pr-2.5 pl-3.5 text-md text-canvas shadow-lg',
            icon: 'grid size-5.5 shrink-0 place-items-center rounded-full bg-canvas/12',
            content: 'flex-1',
            actionButton:
              'shrink-0 cursor-pointer rounded-sm bg-canvas/10 px-2.25 py-1.25 font-semibold text-canvas hover:bg-canvas/16',
          },
        }}
      />
    </QueryClientProvider>
  );
}
