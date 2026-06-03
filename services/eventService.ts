import type {
  CreateEventPayload,
  EventInput,
  EventViewModel,
} from '@/lib/types/event';
import { supabase } from '@/lib/supabase';
import { mapEvent } from '@/lib/mappers/eventMapper';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const getEvents = async (): Promise<EventViewModel[]> => {
  const { data, error } = await supabase
    .from('events')
    .select(
      `
      *,
      event_users (
        user:users (
          id,
          name
        )
      ),
      location:locations (
        id,
        name
      ),
      created_by_user:users!events_created_by_fkey (
        id,
        name
      ),
      booked_by_user:users!events_booked_by_fkey (
        id,
        name
      )
    `,
    )
    .order('event_time', { ascending: false })
    .limit(3);

  if (error) throw error;

  console.log('Fetched raw events:', data);
  const mapped = (data ?? []).map(mapEvent);

  console.log('Mapped events:', mapped);

  return mapped;
};

export const transformInputToPayload = (
  input: EventInput,
): CreateEventPayload => {
  return {
    p_title: input.title,
    p_event_time: new Date(input.eventTime).toISOString(),
    p_location_id: Number(input.locationId),
    p_created_by: Number(input.createdBy),
    p_booked_by: Number(input.bookedBy),
    p_amount: Number(input.amount),
    p_duration: Number(input.duration),
    p_user_ids: input.userIds.map((id) => Number(id)),
    p_notes: input.notes,
  };
};

export const createEvent = async (formData: EventInput) => {
  try {
    const payload: CreateEventPayload = transformInputToPayload(formData);

    const { data, error } = await supabase.rpc(
      'create_event_with_users',
      payload,
    );

    if (error) {
      console.error('createEvent error:', error);
      throw error;
    }

    return {
      success: true,
      data,
    };
  } catch (err) {
    console.error('createEvent exception:', err);

    return {
      success: false,
      error: err,
    };
  }
};

export const deleteEvent = async (eventId: string) => {
  const { data, error } = await supabase
    .from('events')
    .delete()
    .eq('id', eventId);

  if (error) {
    console.error('delete event error:', error);
    throw error;
  }
  return true;
};

export const useEvents = () => {
  return useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};
