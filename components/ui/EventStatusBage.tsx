import type { EventStatus } from '@/lib/types/event';

export function getEventStatusMeta(status: EventStatus) {
  switch (status) {
    case 'upcoming':
      return {
        label: '即將來臨',
        className:
          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-200',
      };

    case 'ongoing':
      return {
        label: '進行中',
        className:
          'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-200',
      };

    case 'past':
      return {
        label: '已過期',
        className:
          'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
      };
  }
}

type Props = {
  status: EventStatus;
};

export default function EventStatusBadge({ status }: Props) {
  const meta = getEventStatusMeta(status);
  return (
    <span className={`px-2 py-1 text-sm rounded-full ${meta.className}`}>
      {meta.label}
    </span>
  );
}
