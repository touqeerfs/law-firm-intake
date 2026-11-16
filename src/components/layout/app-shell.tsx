import type { ReactNode } from 'react';
import { ShellDialogs } from './shell-dialogs';
import { Sidebar } from './sidebar';
import { TabBar } from './tab-bar';
import { TopBar } from './top-bar';

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <ShellDialogs>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-sm focus:bg-accent focus:px-3 focus:py-2 focus:text-on-accent"
      >
        Skip to content
      </a>
      <div className="flex min-h-dvh">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col bg-canvas desktop:my-2 desktop:mr-2 desktop:rounded-xl desktop:border desktop:border-border desktop:shadow-sm">
          <TopBar />
          <main
            id="main"
            tabIndex={-1}
            className="w-full max-w-page flex-1 px-4 pt-4.5 pb-30 focus:outline-none desktop:px-7 desktop:pt-6 desktop:pb-16"
          >
            {children}
          </main>
        </div>
      </div>
      <TabBar />
    </ShellDialogs>
  );
}
