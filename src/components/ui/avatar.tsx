import { cx } from '@/lib/cx';

type AvatarSize = 'xs' | 'sm' | 'md';

type AvatarProps = {
  name: string;
  size?: AvatarSize;
};

const sizeClasses: Record<AvatarSize, string> = {
  xs: 'size-5 text-3xs',
  sm: 'size-6 text-2xs',
  md: 'size-7.5 text-2xs',
};

const gradients = [
  'from-avatar-blue-from to-avatar-blue-to',
  'from-avatar-orange-from to-avatar-orange-to',
  'from-avatar-teal-from to-avatar-teal-to',
  'from-avatar-pink-from to-avatar-pink-to',
  'from-avatar-violet-from to-avatar-violet-to',
  'from-avatar-sky-from to-avatar-sky-to',
  'from-avatar-lime-from to-avatar-lime-to',
  'from-avatar-coral-from to-avatar-coral-to',
];

function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/);
  const first = words[0]?.[0] ?? '';
  const last = words.length > 1 ? (words.at(-1)?.[0] ?? '') : '';
  return (first + last).toUpperCase();
}

function gradientFor(name: string): string | undefined {
  let hash = 0;
  for (const character of name) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  return gradients[hash % gradients.length];
}

export function Avatar({ name, size = 'md' }: AvatarProps) {
  return (
    <span
      aria-hidden
      className={cx(
        'inline-grid shrink-0 place-items-center rounded-full bg-linear-to-br leading-none font-semibold text-on-accent',
        sizeClasses[size],
        gradientFor(name),
      )}
    >
      {initialsOf(name)}
    </span>
  );
}
