import type { EventStatus } from '../types/event';

export function getEventStatus(
  eventTime: string,
  durationHours: string | number,
): EventStatus {
  const now = new Date();
  const start = new Date(eventTime);

  const durationMs = Number(durationHours) * 60 * 60 * 1000;
  const end = new Date(start.getTime() + durationMs);

  if (now < start) return 'upcoming';
  if (now >= start && now <= end) return 'ongoing';
  return 'past';
}
