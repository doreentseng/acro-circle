import type { EventRaw, EventViewModel } from '@/lib/types/event';
import type { UserViewModel } from '@/lib/types/user';
import type { LocationViewModel } from '@/lib/types/location';
import { formatEventTimeToTimeLabel } from '@/lib/utils/formatTime';
import { mapUser } from '@/lib/mappers/userMapper';

export function mapEvent(raw: EventRaw): EventViewModel {
  return {
    // base fields (from Event)
    id: String(raw.id),
    title: raw.title,
    eventTime: raw.event_time,
    amount: String(raw.amount),
    duration: String(raw.duration),
    notes: raw.notes,

    // relational objects (ViewModel upgrade)
    createdBy: raw.created_by_user
      ? mapUser(raw.created_by_user)
      : ({} as UserViewModel),

    bookedBy: raw.booked_by_user
      ? mapUser(raw.booked_by_user)
      : ({} as UserViewModel),
    location: raw.location
      ? {
          ...raw.location,
          id: String(raw.location.id),
          mapUrl: raw.location.map_url,
          officialUrl: raw.location.official_url
        }
      : ({} as LocationViewModel),

    users: raw.event_users?.map((eu) => mapUser(eu.user)) ?? [],

    timeLabel: formatEventTimeToTimeLabel(raw.event_time, Number(raw.duration)),
  };
}
