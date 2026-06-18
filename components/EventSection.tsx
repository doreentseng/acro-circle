'use client';

import { useState } from 'react';
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
import LocationLink from './LocationLink';
import type { LocationViewModel } from '@/lib/types/location';
import { cardClass } from '@/lib/styles/card';
import { useToast } from '@/providers/ToastProvider';
import { Alert } from './ui/Alert';
import { getErrorMessage } from '@/lib/utils/getErrorMessage';
import { linkClass } from '@/lib/styles/button';

const NOW = Date.now();

type EventAlert = {
  type: 'error' | 'success';
  message: string;
};

type EventAlerts = Record<string, EventAlert>;

export default function EventSection({
  onClickLocationLink,
}: {
  onClickLocationLink: (v: LocationViewModel) => void;
}) {
  const { showToast } = useToast();
  const { data: events, isPending: isLoading } = useEvents();
  const {
    mutateAsync: deleteEvent,
    isPending: isDeleting,
    variables: deletingEventId,
  } = useDeleteEvent();

  const [alerts, setAlerts] = useState<EventAlerts>({});
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(
    null
  );

  const handleDeleteEvent = async (eventId: string) => {
    setAlerts((prev) => {
      const next = { ...prev };
      delete next[eventId];
      return next;
    });

    try {
      await deleteEvent(`${eventId}`);
      showToast('刪除成功', 'delete');
    } catch (e: unknown) {
      console.warn(e);
      setAlerts((prev) => ({
        ...prev,
        [eventId]: {
          type: 'error',
          message: `刪除失敗，${getErrorMessage(e)}`,
        },
      }));
    }
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
    <div className={cardClass}>
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
            return (
              <div
                key={event.id}
                className={`
                  relative p-4 rounded-md border border-zinc-200 dark:border-zinc-800
                  space-y-2 transition
                  ${
                    isPast
                      ? 'bg-zinc-100 dark:bg-zinc-900 opacity-60'
                      : 'bg-zinc-50 dark:bg-zinc-950'
                  }
                `}
              >
                <div className="lg:absolute lg:top-3 lg:right-3 static mb-2 mb-0">
                  <EventStatusBadge status={status} />
                </div>

                <div className="font-medium text-md text-zinc-800 dark:text-zinc-100">
                  {event.timeLabel}
                </div>

                <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                  {event.title}
                </div>

                <div className="flex gap-4 text-sm text-zinc-500 dark:text-zinc-400">
                  <div className="text-sm flex items-center gap-1">
                    <MapPinIcon className={iconClass} />
                    <LocationLink
                      key={event.location.id}
                      location={event.location}
                      onClick={onClickLocationLink}
                    />
                  </div>
                  <div className="text-sm flex items-center gap-1">
                    <CurrencyDollarIcon className={iconClass} /> {event.amount}
                  </div>
                  <div className="text-sm flex items-center gap-1">
                    <ClockIcon className={iconClass} /> {event.duration} 小時
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-zinc-600 dark:text-zinc-400 pt-2">
                  <span>
                    建立者:{' '}
                    <UserTag user={event.createdBy} className="text-xs" />
                  </span>
                  <span>
                    預訂者:{' '}
                    <UserTag user={event.bookedBy} className="text-xs" />
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-zinc-600 dark:text-zinc-400 pt-2">
                  <span>
                    參與者:{' '}
                    {event.users.map((u) => (
                      <UserTag key={u.id} user={u} className="text-xs mr-1" />
                    ))}
                  </span>
                </div>

                {event.notes && (
                  <div className="text-xs text-zinc-600 dark:text-zinc-400 border-t pt-2">
                    備註：{event.notes}
                  </div>
                )}

                {alerts[event.id] && (
                  <Alert className="mt-5" type={alerts[event.id].type}>
                    {alerts[event.id].message}
                  </Alert>
                )}
                {confirmingDeleteId === event.id ? (
                  <div className="mt-4 flex items-center gap-2 text-xs">
                    <span className="text-red-600 dark:text-red-400">
                      是否確認刪除？
                    </span>
                    <button
                      className={linkClass}
                      onClick={() => setConfirmingDeleteId(null)}
                    >
                      取消
                    </button>
                    or
                    <button
                      className={linkClass}
                      onClick={() => {
                        handleDeleteEvent(event.id);
                        setConfirmingDeleteId(null);
                      }}
                    >
                      確認刪除
                    </button>
                  </div>
                ) : (
                  <button
                    className="
                      mt-4 w-40 text-xs
                      text-red-600 dark:text-red-400
                      hover:underline
                      transition cursor-pointer flex items-center gap-1
                      disabled:opacity-50 disabled:cursor-not-allowed
                    "
                    disabled={isDeleting && event.id === deletingEventId}
                    onClick={() => setConfirmingDeleteId(event.id)}
                  >
                    <TrashIcon className="w-4 h-4" />
                    {isDeleting && event.id === deletingEventId
                      ? '刪除中'
                      : '刪除預約'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
