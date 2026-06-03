'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { EventInput } from '@/lib/types/event';
import type { UserViewModel } from '@/lib/types/user';
import type { LocationViewModel } from '@/lib/types/location';
import { getUsers } from '@/services/userService';
import { getLocations } from '@/services/locationService';
import { BoltIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import SectionTitle from '@/components/ui/SectionTitle';
import FormField from '@/components/ui/FormField';
import UserTag from '@/components/ui/UserTag';
import EventSection from '@/components/EventSection';
import LocationSection from '@/components/LocationSection';
import UserSection from '@/components/UserSection';
import { useRouter } from 'next/navigation';
import { requireAuth } from '@/lib/auth/requireAuth';
import { CheckboxSkeleton, RadioSkeleton } from '@/components/ui/Skeleton';
import { useCreateEvent } from '@/services/eventService';
import { checkboxClass, inputClass, radioClass } from '@/lib/styles/input';
import PageHeader from '@/components/ui/PageHeadet';
import Footer from '@/components/ui/Footer';

const DEFAULT_FORM = {
  title: 'Acroyoga 練習',
  createdBy: '',
  eventTime: '',
  bookedBy: '',
  locationId: '',
  userIds: [],
  amount: '1000',
  duration: '2',
  notes: '',
};

export default function Dashboard() {
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState<UserViewModel['id']>('');
  const [users, setUsers] = useState<UserViewModel[]>([]);
  const [locations, setLocations] = useState<LocationViewModel[]>([]);
  const { mutate: createEvent, isPending: isCreating } = useCreateEvent();
  const [form, setForm] = useState<EventInput>(DEFAULT_FORM);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

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

    const loadUsers = async () => {
      const users = await getUsers();
      console.log('Users in Dashboard:', users);
      if (users.length > 0 && form.userIds.length === 0) {
        setForm((prev) => ({
          ...prev,
          userIds: ['1', '2', '3', '4'],
          bookedBy: '3',
        }));
      }
      setUsers(users);
    };

    const loadLocations = async () => {
      const locations = await getLocations();
      if (locations.length > 0 && !form.locationId) {
        setForm((prev) => ({
          ...prev,
          locationId: locations[0].id,
        }));
      }
      setLocations(locations);
    };

    loadCurrentUser();
    loadUsers();
    loadLocations();
  }, [form.userIds.length, form.locationId, router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.title) newErrors.title = '請輸入標題';
    if (!form.eventTime) newErrors.eventTime = '請選擇時間';
    if (!form.locationId) newErrors.locationId = '請選擇地點';
    if (!form.amount) newErrors.amount = '請輸入金額';
    if (!form.duration) newErrors.duration = '請輸入時長';
    if (!form.bookedBy) newErrors.bookedBy = '請選擇預訂場地的人';
    if (!form.userIds || form.userIds.length === 0) {
      newErrors.userIds = '請至少選擇一位參與人員';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = validateForm();
    console.log('Form validation errors:', newErrors);
    setFormErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    console.log('Form submitted:', form);
    console.log('Current user ID:', currentUserId);

    createEvent({
      ...form,
      createdBy: currentUserId,
    });
    setForm(DEFAULT_FORM);
  };

  return (
    <div className="min-h-screen bg-zinc-100 flex justify-center px-6">
      <div className="w-full max-w-6xl py-8">
        <PageHeader />
        <div className="grid grid-cols-7 gap-4">
          <div className="col-span-3 space-y-4">
            <EventSection />
          </div>

          <div className="col-span-3 space-y-4">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-lg shadow-md p-5 space-y-3"
            >
              <SectionTitle
                icon={<BoltIcon className="w-5 h-5" />}
                title="預約表單"
              />

              <FormField label="標題" required error={formErrors.title}>
                <input
                  className={inputClass}
                  placeholder="例如：Acroyoga 練習"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </FormField>

              <FormField label="時間" required error={formErrors.eventTime}>
                <input
                  type="datetime-local"
                  className={inputClass}
                  value={form.eventTime}
                  onChange={(e) =>
                    setForm({ ...form, eventTime: e.target.value })
                  }
                />
              </FormField>

              <FormField label="地點" required error={formErrors.locationId}>
                <div className="relative">
                  <select
                    className={inputClass + ' appearance-none'}
                    value={form.locationId}
                    onChange={(e) =>
                      setForm({ ...form, locationId: e.target.value })
                    }
                  >
                    <option value="">選擇地點</option>
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                </div>
              </FormField>

              <FormField label="參與人員" required error={formErrors.userIds}>
                <div className="flex flex-wrap gap-4">
                  {users.length === 0 ? (
                    <>
                      <CheckboxSkeleton />
                      <CheckboxSkeleton />
                      <CheckboxSkeleton />
                    </>
                  ) : (
                    users.map((user) => (
                      <label
                        key={user.id}
                        className="flex items-center gap-2 bg-white text-sm text-zinc-700 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={form.userIds?.includes(user.id)}
                          onChange={(e) => {
                            const users = form.userIds || [];

                            if (e.target.checked) {
                              setForm({
                                ...form,
                                userIds: [...users, user.id],
                              });
                            } else {
                              setForm({
                                ...form,
                                userIds: users.filter((p) => p !== user.id),
                              });
                            }
                          }}
                          className={checkboxClass}
                        />
                        <UserTag user={user} className="text-xs" />
                      </label>
                    ))
                  )}
                </div>
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="時長" required error={formErrors.duration}>
                  <input
                    type="number"
                    min={0}
                    step={0.5}
                    className={inputClass}
                    placeholder="例如：1.5"
                    value={form.duration}
                    onChange={(e) =>
                      setForm({ ...form, duration: e.target.value })
                    }
                  />
                </FormField>

                <FormField label="金額" required error={formErrors.amount}>
                  <input
                    type="number"
                    className={inputClass}
                    placeholder="例如：300"
                    value={form.amount}
                    onChange={(e) =>
                      setForm({ ...form, amount: e.target.value })
                    }
                  />
                </FormField>
              </div>

              <FormField
                label="預定場地的人"
                required
                error={formErrors.bookedBy}
              >
                <div className="flex flex-wrap gap-4">
                  {users.length === 0 ? (
                    <>
                      <RadioSkeleton />
                      <RadioSkeleton />
                      <RadioSkeleton />
                    </>
                  ) : (
                    users.map((user) => (
                      <label
                        key={user.id}
                        className="flex items-center gap-2 bg-white text-sm text-zinc-700 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="bookedBy"
                          checked={form.bookedBy === user.id}
                          onChange={() =>
                            setForm({ ...form, bookedBy: user.id })
                          }
                          className={radioClass}
                        />
                        <UserTag user={user} className="text-xs" />
                      </label>
                    ))
                  )}
                </div>
              </FormField>

              <FormField label="備註">
                <input
                  className={inputClass}
                  placeholder="例如：開門密碼1234"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </FormField>

              <button
                disabled={isCreating}
                className="w-full px-4 py-2 rounded-md bg-pink-500 text-white transition cursor-pointer
                  hover:bg-pink-400
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-pink-400"
              >
                {isCreating ? '建立中...' : '建立預約'}
              </button>
            </form>
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
