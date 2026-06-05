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
import LocationModal from '@/components/LocationModel';
import LocationLink from '@/components/LocationLink';

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

  const [selectedLocation, setSelectedLocation] =
    useState<LocationViewModel | null>(null);

  const handleClickLocationLink = (v: LocationViewModel) => {
    setSelectedLocation(v);
  };

  return (
    <div className="min-h-screen flex justify-center px-6 bg-[var(--background)] text-[var(--foreground)]">
      <div className="w-full max-w-6xl py-8">
        <PageHeader />

        <LocationModal
          location={selectedLocation}
          onClose={() => setSelectedLocation(null)}
        />

        {/** desktop UI */}
        <div className="hidden md:grid md:grid-cols-7 gap-4">
          <div className="col-span-3">
            <EventSection onClickLocationLink={handleClickLocationLink} />
          </div>
          <div className="col-span-3">
            <CreateEventSection
              currentUserId={currentUserId}
              users={users}
              locations={locations}
            />
          </div>
          <div className="col-span-1 space-y-4">
            <LocationSection
              locations={locations}
              onClickLocationLink={handleClickLocationLink}
            />
            <UserSection users={users} />
          </div>
        </div>

        {/** mobile UI */}
        <div className="flex flex-col gap-4 md:hidden">
          <CreateEventSection
            currentUserId={currentUserId}
            users={users}
            locations={locations}
          />
          <EventSection onClickLocationLink={handleClickLocationLink} />
          <LocationSection
            locations={locations}
            onClickLocationLink={handleClickLocationLink}
          />
          <UserSection users={users} />
        </div>
        <Footer />
      </div>
    </div>
  );
}
