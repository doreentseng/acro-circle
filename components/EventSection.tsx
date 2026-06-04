import { CalendarDaysIcon } from '@heroicons/react/24/solid';
import SectionTitle from '@/components/ui/SectionTitle';
import UserTag from '@/components/ui/UserTag';
import {
  ClockIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  TrashIcon,
} from '@heroicons/react/24/solid';
import EventStatusBadge from './ui/EventStatusBage';
import { getEventStatus } from '@/lib/utils/getEventStatus';
import { SectionSkeleton } from './ui/Skeleton';
import EmptyState from './ui/EmptyState';
import { useEvents, useDeleteEvent } from '@/services/eventService';
import { iconClass } from '@/lib/styles/icon';

const NOW = Date.now();

export default function EventSection() {
  const { data: events, isPending: isLoading } = useEvents();
  const {
    mutate: deleteEvent,
    isPending: isDeleting,
    variables,
  } = useDeleteEvent();

  const handleDeleteEvent = (eventId: string) => {
    console.log(eventId);
    deleteEvent(eventId);
  };

  /**
   * Sort events based on:
   * 1. Whether the event is past or future
   * 2. Distance from current time (absolute difference)
   *
   * Sorting rules:
   * - Future events always appear before past events
   * - Within each group (future / past), events are sorted by how close they are to "now"
   *   (closer events appear first)
   */
  const sortedEvents = [...(events ?? [])].sort((a, b) => {
    // Convert event time string into timestamp for comparison
    const aTime = new Date(a.eventTime).getTime();
    const bTime = new Date(b.eventTime).getTime();

    // Determine whether each event is in the past
    const aPast = getEventStatus(a.eventTime, a.duration) === 'past';
    const bPast = getEventStatus(b.eventTime, b.duration) === 'past';

    /**
     * 1. Primary sort rule: group by past/future
     * - Future events (aPast === false) should come first
     * - Past events (aPast === true) should come later
     */
    if (aPast !== bPast) {
      return aPast ? 1 : -1;
    }

    /**
     * 2. Secondary sort rule: distance from current time
     * We use absolute difference so both:
     * - Upcoming events
     * - Past events
     * are ordered by proximity to "now"
     */
    const aDistance = Math.abs(NOW - aTime);
    const bDistance = Math.abs(NOW - bTime);

    return aDistance - bDistance;
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-5">
      <SectionTitle
        icon={<CalendarDaysIcon className="w-5 h-5" />}
        title="最近三筆預約"
      />
      {isLoading ? <SectionSkeleton /> : null}
      {!isLoading && events?.length === 0 ? <EmptyState /> : null}
      {!isLoading && events && events?.length > 0 ? (
        <div className="space-y-3">
          {sortedEvents?.map((event) => {
            const status = getEventStatus(event.eventTime, event.duration);
            const isPast = status === 'past';
            const isDeletingThis = isDeleting && variables === event.id;
            return (
              <div
                key={event.id}
                className={`relative p-4 rounded-md border border-zinc-200 space-y-2 transition
                ${isPast ? 'bg-zinc-100 opacity-40' : 'bg-zinc-50'}
              `}
              >
                <div className="lg:absolute lg:top-3 lg:right-3 static mb-2 mb-0">
                  <EventStatusBadge status={status} />
                </div>

                <div className="font-medium text-md text-zinc-800">
                  {event.timeLabel}
                </div>

                <div className="text-sm font-semibold text-zinc-700">
                  {event.title}
                </div>

                <div className="flex gap-4 text-sm text-zinc-500">
                  <div className="text-sm text-zinc-500 flex items-center gap-1">
                    <MapPinIcon className={iconClass} /> {event.location.name}
                  </div>
                  <div className="text-sm text-zinc-500 flex items-center gap-1">
                    <CurrencyDollarIcon className={iconClass} /> {event.amount}
                  </div>
                  <div className="text-sm text-zinc-500 flex items-center gap-1">
                    <ClockIcon className={iconClass} /> {event.duration} 小時
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-zinc-600 pt-2">
                  <span>
                    建立者:{' '}
                    <UserTag user={event.createdBy} className="text-xs" />
                  </span>
                  <span>
                    預訂者:{' '}
                    <UserTag user={event.bookedBy} className="text-xs" />
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-zinc-600 pt-2">
                  <span>
                    參與者:{' '}
                    {event.users.map((u) => (
                      <UserTag key={u.id} user={u} className="text-xs mr-1" />
                    ))}
                  </span>
                </div>

                {event.notes && (
                  <div className="text-xs text-zinc-600 border-t pt-2">
                    備註：{event.notes}
                  </div>
                )}

                <button
                  className="mt-4 w-40 text-xs text-red-600 hover:text-red-600 hover:underline transition cursor-pointer flex items-center gap-1
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                  disabled={isDeletingThis}
                  onClick={() => handleDeleteEvent(event.id)}
                >
                  <TrashIcon className="w-4 h-4" />

                  {isDeletingThis ? '刪除中' : '刪除預約'}
                </button>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
