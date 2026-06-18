import { supabase } from '@/lib/supabase';
import { PATHNAME } from '@/lib/constants/pathname';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export async function requireAuth(router: AppRouterInstance) {
  // Check if it's guest mode
  if (typeof window !== 'undefined') {
    const guestMode = localStorage.getItem('guestMode');
    if (guestMode === 'true') {
      return null; // allow guest mode on
    }
  }

  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    router.push(PATHNAME.LOGIN);
  }

  return data.user;
}
