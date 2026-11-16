import { z } from 'zod';

const themeSchema = z.enum(['light', 'dark']);
export type Theme = z.infer<typeof themeSchema>;

const STORAGE_KEY = 'intake-desk/theme';
const listeners = new Set<() => void>();

export const themeScript = `try {
  var theme = localStorage.getItem('${STORAGE_KEY}');
  if (theme !== 'light' && theme !== 'dark') {
    theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.documentElement.dataset.theme = theme;
} catch {}`;

export function readTheme(): Theme {
  const result = themeSchema.safeParse(document.documentElement.dataset.theme);
  return result.success ? result.data : 'light';
}

export function writeTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  listeners.forEach((listener) => listener());
  window.localStorage.setItem(STORAGE_KEY, theme);
}

export function subscribeToTheme(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
