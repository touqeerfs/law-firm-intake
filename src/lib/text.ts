export function normalizeText(text: string): string {
  return text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
}

export function digitsOnly(text: string): string {
  return text.replace(/\D/g, '');
}

export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? name;
}
