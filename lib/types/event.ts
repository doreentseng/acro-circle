import { LocationRaw, LocationViewModel } from './location';
import { UserRaw, UserViewModel } from './user';

export type EventStatus = 'upcoming' | 'ongoing' | 'past';

export interface EventInput {
  title: string;
  createdAt?: string;
  createdBy: string;
  eventTime: string;
  bookedBy: string;
  locationId: LocationViewModel['id'];
  userIds: UserViewModel['id'][];
  amount: string;
  duration: string;
  notes?: string;
}

export interface EventViewModel {
  id: string;
  title: string;
  eventTime: string;
  amount: string;
  duration: string;
  notes?: string;
  createdBy: UserViewModel;
  bookedBy: UserViewModel;
  location: LocationViewModel;
  users: UserViewModel[];
  timeLabel: string; // e.g. 2026/06/02（星期二）19:00-21:00
  reminder3dSent: boolean;
  reminder1dSent: boolean;
  lineGroupId: string;
}

export interface EventRaw {
  id: string;
  title: string;
  created_at?: string;
  created_by: {
    user: UserRaw;
  };
  event_time: string;
  booked_by: {
    user: UserRaw;
  };
  location_id: number;
  amount: string;
  duration: string;
  notes?: string;

  // join result (event_users → users)
  event_users?: {
    user: UserRaw;
  }[];

  // if you also join location / users directly
  location?: LocationRaw;
  created_by_user?: UserRaw;
  booked_by_user?: UserRaw;

  reminder_3d_sent: boolean;
  reminder_1d_sent: boolean;
  line_group_id: string;
}

export interface CreateEventPayload {
  p_title: string;
  p_event_time: string;
  p_location_id: number;
  p_created_by: number;
  p_booked_by: number;
  p_amount: number;
  p_duration: number;
  p_user_ids: number[];
  p_notes?: string;
}
