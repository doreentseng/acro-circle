export const CheckboxSkeleton = () => {
  return (
    <div className="flex items-center gap-2 animate-pulse">
      <div className="h-4 w-4 rounded border border-zinc-300 bg-zinc-200" />
      <div className="h-3 w-24 bg-zinc-200 rounded" />
    </div>
  );
};
export function RadioSkeleton() {
  return (
    <div className="flex items-center gap-2 animate-pulse">
      <div className="h-4 w-4 rounded-full border border-zinc-300 bg-zinc-200" />
      <div className="h-3 w-24 bg-zinc-200 rounded" />
    </div>
  );
}

type SectionSkeletonProps = {
  size?: 'sm' | 'md' | 'lg';
};

const sizeMap = {
  sm: {
    itemHeight: 'h-3',
    gap: 'space-y-2',
    count: 2,
  },
  md: {
    itemHeight: 'h-5',
    gap: 'space-y-2',
    count: 3,
  },
  lg: {
    itemHeight: 'h-6',
    gap: 'space-y-3',
    count: 4,
  },
};

export function SectionSkeleton({ size = 'md' }: SectionSkeletonProps) {
  const config = sizeMap[size];

  return (
    <div className={`animate-pulse ${config.gap}`}>
      {Array.from({ length: config.count }).map((_, i) => (
        <div
          key={i}
          className={`w-full rounded-md bg-zinc-200 ${config.itemHeight}`}
        />
      ))}
    </div>
  );
}
