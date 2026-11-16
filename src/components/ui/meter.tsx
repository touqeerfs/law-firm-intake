import { cx } from '@/lib/cx';

type MeterTone = 'neutral' | 'ok' | 'warn' | 'danger';

type MeterProps = {
  value: number;
  max: number;
  tone: MeterTone;
};

const fillClasses: Record<MeterTone, string> = {
  neutral: 'bg-closed',
  ok: 'bg-won',
  warn: 'bg-warn',
  danger: 'bg-danger',
};

export function Meter({ value, max, tone }: MeterProps) {
  // A small minimum keeps a zero value visible as a sliver instead of an empty track
  const percent = Math.min(100, Math.max(6, (value / max) * 100));

  return (
    <span
      aria-hidden
      className="relative h-1.25 w-11 shrink-0 overflow-hidden rounded-full bg-surface-3"
    >
      <span
        className={cx('absolute inset-y-0 left-0 rounded-full', fillClasses[tone])}
        style={{ width: `${percent}%` }}
      />
    </span>
  );
}
