import { supabase } from '@/lib/supabase';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export async function requireAuth(router: AppRouterInstance) {
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    router.push('/login');
  }

  return data.user;
}
