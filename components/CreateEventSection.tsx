'use client';

import { useEffect, useState, useRef } from 'react';
import type { EventInput } from '@/lib/types/event';
import type { UserViewModel } from '@/lib/types/user';
import type { LocationViewModel } from '@/lib/types/location';
import { BoltIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import SectionTitle from '@/components/ui/SectionTitle';
import FormField from '@/components/ui/FormField';
import UserTag from '@/components/ui/UserTag';
import { CheckboxSkeleton, RadioSkeleton } from '@/components/ui/Skeleton';
import { useCreateEvent } from '@/services/eventService';
import {
  checkboxClass,
  inputClass,
  radioClass,
  optionItemClass,
} from '@/lib/styles/form';
import { cardClass } from '@/lib/styles/card';
import { buttonClass, primary } from '@/lib/styles/button';
import { useToast } from '@/providers/ToastProvider';
import { Alert, EMPTY_ALERT_DATA } from './ui/Alert';

const EMPTY_FORM = {
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

export default function CreateEventSection({
  currentUserId,
  users,
  locations,
}: {
  currentUserId: UserViewModel['id'];
  users: UserViewModel[];
  locations: LocationViewModel[];
}) {
  const { mutate: createEvent, isPending: isCreating } = useCreateEvent();
  const [form, setForm] = useState<EventInput>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const hasInitialized = useRef(false);
  const { showToast } = useToast();

  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState(EMPTY_ALERT_DATA);
  const resetAlert = () => {
    setShowAlert(false);
    setAlertData(EMPTY_ALERT_DATA);
  };

  const setDefaultForm = () => {
    setForm({
      ...EMPTY_FORM,
      userIds: ['1', '2', '3', '4'],
      bookedBy: '3',
      locationId: locations[0].id,
    });
  };

  useEffect(() => {
    if (!locations.length) return;
    if (hasInitialized.current) return;

    setDefaultForm();

    hasInitialized.current = true;
  }, [locations]);

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
    resetAlert();

    const newErrors = validateForm();
    // console.log('Form validation errors:', newErrors);
    setFormErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    // console.log('Form submitted:', form);
    // console.log('Current user ID:', currentUserId);

    try {
      createEvent({
        ...form,
        createdBy: currentUserId,
      });
      setDefaultForm();
      showToast('創建預約成功', 'success');
    } catch (e) {
      if (e instanceof Error) {
        setShowAlert(true);
        setAlertData({
          type: 'error',
          title: '創建預約失敗',
          message: e.message,
        });
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={cardClass}>
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
            style={{ WebkitAppearance: 'none' }}
            value={form.eventTime}
            onChange={(e) => setForm({ ...form, eventTime: e.target.value })}
          />
        </FormField>

        <FormField label="地點" required error={formErrors.locationId}>
          <div className="relative">
            <select
              className={inputClass + ' appearance-none'}
              value={form.locationId}
              onChange={(e) => setForm({ ...form, locationId: e.target.value })}
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
          <div className="flex flex-wrap gap-2">
            {users.length === 0 ? (
              <>
                <CheckboxSkeleton />
                <CheckboxSkeleton />
                <CheckboxSkeleton />
              </>
            ) : (
              users.map((user) => (
                <label key={user.id} className={optionItemClass}>
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
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
            />
          </FormField>

          <FormField label="金額" required error={formErrors.amount}>
            <input
              type="number"
              className={inputClass}
              placeholder="例如：300"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
          </FormField>
        </div>

        <FormField label="預定場地的人" required error={formErrors.bookedBy}>
          <div className="flex flex-wrap gap-2">
            {users.length === 0 ? (
              <>
                <RadioSkeleton />
                <RadioSkeleton />
                <RadioSkeleton />
              </>
            ) : (
              users.map((user) => (
                <label key={user.id} className={optionItemClass}>
                  <input
                    type="radio"
                    name="bookedBy"
                    checked={form.bookedBy === user.id}
                    onChange={() => setForm({ ...form, bookedBy: user.id })}
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
        {showAlert && (
          <Alert type={alertData.type} message={alertData.message} />
        )}
        <button disabled={isCreating} className={`${buttonClass} ${primary}`}>
          {isCreating ? '建立中...' : '建立預約'}
        </button>
      </form>
    </>
  );
}
