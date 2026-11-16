import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Figtree, JetBrains_Mono } from 'next/font/google';
import { AppShell } from '@/components/layout/app-shell';
import { Providers } from '@/components/layout/providers';
import { cx } from '@/lib/cx';
import './globals.css';

const bricolage = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-bricolage' });
const figtree = Figtree({ subsets: ['latin'], variable: '--font-figtree' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' });

export const metadata: Metadata = {
  title: { template: '%s · Intake Desk', default: 'Intake Desk' },
  description: 'Client intake for Karim, Sheikh & Mercer.',
};

export const viewport: Viewport = {
  viewportFit: 'cover',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={cx(bricolage.variable, figtree.variable, jetbrainsMono.variable)}>
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
