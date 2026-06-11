import { supabase } from '@/lib/supabase';
import { PATHNAME } from '../constants/pathname';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export async function requireAuth(router: AppRouterInstance) {
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    router.push(PATHNAME.LOGIN);
  }

  return data.user;
}
