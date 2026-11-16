import { cx } from '@/lib/cx';

type SkeletonProps = {
  className: string;
};

export function Skeleton({ className }: SkeletonProps) {
  return (
    <span aria-hidden className={cx('block animate-pulse rounded-full bg-surface-3', className)} />
  );
}
