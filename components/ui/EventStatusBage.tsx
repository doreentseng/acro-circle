import type { EventStatus } from '@/lib/types/event';

export function getEventStatusMeta(status: EventStatus) {
  switch (status) {
    case 'upcoming':
      return {
        label: '即將來臨',
        className: 'bg-red-600 text-white',
      };
    case 'ongoing':
      return {
        label: '進行中',
        className: 'bg-green-500 text-white',
      };
    case 'past':
      return {
        label: '已過期',
        className: 'bg-zinc-200 text-zinc-600',
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
