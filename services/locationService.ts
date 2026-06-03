import { mapLocation } from '@/lib/mappers/locationMapper';
import { supabase } from '@/lib/supabase';

export async function getLocations() {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .order('id', { ascending: true });

  if (error) throw error;
  const mapped = (data ?? []).map(mapLocation);
  return mapped;
}
