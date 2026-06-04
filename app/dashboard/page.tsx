'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { UserViewModel } from '@/lib/types/user';
import type { LocationViewModel } from '@/lib/types/location';
import { getUsers } from '@/services/userService';
import { getLocations } from '@/services/locationService';
import EventSection from '@/components/EventSection';
import LocationSection from '@/components/LocationSection';
import UserSection from '@/components/UserSection';
import { useRouter } from 'next/navigation';
import { requireAuth } from '@/lib/auth/requireAuth';
import PageHeader from '@/components/ui/PageHeader';
import Footer from '@/components/ui/Footer';
import CreateEventSection from '@/components/CreateEventSection';

export default function Dashboard() {
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState<UserViewModel['id']>('');
  const [users, setUsers] = useState<UserViewModel[]>([]);
  const [locations, setLocations] = useState<LocationViewModel[]>([]);

  useEffect(() => {
    requireAuth(router);

    const loadCurrentUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        console.error('Error fetching current user:', error);
        router.push('/login');
        return;
      }

      const userId = user.user_metadata.userId;
      if (!userId) {
        console.error('Current user has no userId in metadata');
        router.push('/login');
        return;
      }
      setCurrentUserId(userId);
    };

    const loadLocations = async () => {
      const locations = await getLocations();
      setLocations(locations);
    };

    const loadUsers = async () => {
      const users = await getUsers();
      setUsers(users);
    };

    loadCurrentUser();
    loadLocations();
    loadUsers();
  }, [router]);

  return (
    <div className="min-h-screen bg-zinc-100 flex justify-center px-6">
      <div className="w-full max-w-6xl py-8">
        <PageHeader />
        <div className="grid grid-cols-7 gap-4">
          <div className="col-span-3 space-y-4">
            <EventSection />
          </div>

          <div className="col-span-3 space-y-4">
            <CreateEventSection
              currentUserId={currentUserId}
              users={users}
              locations={locations}
            />
          </div>

          <div className="col-span-1 space-y-4">
            <LocationSection locations={locations} />
            <UserSection users={users} />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
