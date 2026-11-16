export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'intake-desk/theme';
const listeners = new Set<() => void>();

export const themeScript = `try {
  var theme = localStorage.getItem('${STORAGE_KEY}');
  if (theme !== 'light' && theme !== 'dark') {
    theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.documentElement.dataset.theme = theme;
} catch (error) {}`;

export function readTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

export function writeTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  window.localStorage.setItem(STORAGE_KEY, theme);
  listeners.forEach((listener) => listener());
}

export function subscribeToTheme(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
