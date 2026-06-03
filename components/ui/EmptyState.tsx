import { InboxIcon } from '@heroicons/react/24/outline';

type EmptyStateProps = {
  title?: string;
  description?: string;
};

export default function EmptyState({
  title = '沒有資料',
  description = '目前沒有任何內容',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {/* icon */}
      <div className="mb-4 rounded-full bg-zinc-100 p-4">
        <InboxIcon className="h-8 w-8 text-zinc-400" />
      </div>

      {/* title */}
      <h3 className="text-sm font-semibold text-zinc-800">{title}</h3>

      {/* description */}
      <p className="mt-1 text-sm text-zinc-500">{description}</p>
    </div>
  );
}
