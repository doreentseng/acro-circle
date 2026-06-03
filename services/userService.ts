import { mapUser } from '@/lib/mappers/userMapper';
import { supabase } from '@/lib/supabase';

export async function getUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('id', { ascending: true });
  if (error) throw error;
  const mapped = (data ?? []).map(mapUser);
  return mapped;
}
