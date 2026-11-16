import { z } from 'zod';

const networkModeSchema = z.enum(['normal', 'slow', 'failing']);
export type NetworkMode = z.infer<typeof networkModeSchema>;

const STORAGE_KEY = 'intake-desk/network';
const listeners = new Set<() => void>();

export function readNetworkMode(): NetworkMode {
  const result = networkModeSchema.safeParse(window.localStorage.getItem(STORAGE_KEY));
  return result.success ? result.data : 'normal';
}

export function writeNetworkMode(mode: NetworkMode): void {
  window.localStorage.setItem(STORAGE_KEY, mode);
  listeners.forEach((listener) => listener());
}

export function subscribeToNetworkMode(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
