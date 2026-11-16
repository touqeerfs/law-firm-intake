'use client';

import { useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { readTheme, subscribeToTheme, writeTheme, type Theme } from '@/lib/theme';

function serverTheme(): Theme {
  return 'light';
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeToTheme, readTheme, serverTheme);
  const isDark = theme === 'dark';
  const label = isDark ? 'Switch to light theme' : 'Switch to dark theme';
  const Icon = isDark ? Sun : Moon;

  return (
    <Button
      variant="ghost"
      iconOnly
      aria-label={label}
      title={label}
      onClick={() => writeTheme(isDark ? 'light' : 'dark')}
    >
      <Icon className="size-4.25" aria-hidden />
    </Button>
  );
}
