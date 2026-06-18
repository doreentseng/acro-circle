'use client';

import { useEffect, useState } from 'react';
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
import { useToast } from '@/providers/ToastProvider';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { useAuth } from '@/providers/AuthProvider';
import UserProfile from '@/components/UserProfile';
import GuestModeNotice from '@/components/GuestModeNotice';
import { mockUsers, mockLocations } from '@/lib/data/mockData';

export default function Dashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<UserViewModel[]>([]);
  const [locations, setLocations] = useState<LocationViewModel[]>([]);
  const { toasts, removeToast } = useToast();
  const { currentUser, isGuest, isLoading: authLoading } = useAuth();

  useEffect(() => {
    // Wait for AuthProvider initialization to complete
    if (authLoading) return;

    requireAuth(router);

    // load users and locations data
    const loadData = async () => {
      if (isGuest) {
        setUsers(mockUsers);
        setLocations(mockLocations);
        return;
      }

      const [locationsData, usersData] = await Promise.all([
        getLocations(),
        getUsers(),
      ]);

      setLocations(locationsData);
      setUsers(usersData);
    };

    loadData();
  }, [router, isGuest, authLoading]);

  const [selectedLocation, setSelectedLocation] =
    useState<LocationViewModel | null>(null);

  const handleClickLocationLink = (v: LocationViewModel) => {
    setSelectedLocation(v);
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen flex justify-center px-6 bg-[var(--background)] text-[var(--foreground)]">
      <div className="w-full max-w-6xl py-8">
        <PageHeader />
        <UserProfile />
        <GuestModeNotice />

        <LocationModal
          location={selectedLocation}
          onClose={() => setSelectedLocation(null)}
        />
        <ToastContainer toasts={toasts} onClose={removeToast} />

        {/** desktop UI */}
        <div className="hidden md:grid md:grid-cols-7 gap-4">
          <div className="col-span-3">
            <EventSection onClickLocationLink={handleClickLocationLink} />
          </div>
          <div className="col-span-3">
            <CreateEventSection
              currentUserId={currentUser?.id || ''}
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
            currentUserId={currentUser?.id || ''}
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
