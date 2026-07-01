import type { UserViewModel } from '@/lib/types/user';
import type { LocationViewModel } from '@/lib/types/location';
import type { EventViewModel } from '@/lib/types/event';
import { formatEventTimeToTimeLabel } from '@/lib/utils/formatTime';

export const mockUsers: UserViewModel[] = [
  { id: '1', name: '曾豆豆', username: 'beans' },
  { id: '2', name: '妞妞', username: 'niuniu' },
  { id: '3', name: 'QB', username: 'qb' },
  { id: '4', name: '布丁', username: 'pudding' },
  { id: 'guest', name: '訪客', username: 'guest' },
];

export const mockLocations: LocationViewModel[] = [
  {
    id: '1',
    name: '中正運動中心',
    mapUrl: 'https://maps.google.com/?q=中正運動中心',
    officialUrl: 'https://example.com/zhongzheng',
  },
  {
    id: '2',
    name: '大安森林公園',
    mapUrl: 'https://maps.google.com/?q=大安森林公園',
  },
];

export const guestUser: UserViewModel = mockUsers[4];

const createEventTime = (daysOffset: number, hour: number, minute = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

export const mockEvents: EventViewModel[] = [
  {
    id: '1',
    title: '週末練習',
    eventTime: createEventTime(5, 19, 0),
    amount: '300',
    duration: '2',
    notes: '記得帶水和毛巾',
    createdBy: mockUsers[0],
    bookedBy: mockUsers[0],
    location: mockLocations[0],
    users: [mockUsers[0], mockUsers[1], mockUsers[2]],
    timeLabel: formatEventTimeToTimeLabel(
      createEventTime(5, 19, 0),
      2,
    ),
    reminder3dSent: false,
    reminder1dSent: false,
    reminder0dSent: false,
    lineGroupId: 'demo-group-1',
  },
  {
    id: '2',
    title: '進階訓練',
    eventTime: createEventTime(0, new Date().getHours(), 0),
    amount: '400',
    duration: '3',
    notes: '高難度動作練習',
    createdBy: mockUsers[1],
    bookedBy: mockUsers[1],
    location: mockLocations[1],
    users: [mockUsers[1], mockUsers[3], mockUsers[4]],
    timeLabel: formatEventTimeToTimeLabel(
      createEventTime(0, new Date().getHours(), 0),
      2,
    ),
    reminder3dSent: false,
    reminder1dSent: false,
    reminder0dSent: false,
    lineGroupId: 'demo-group-1',
  },
  {
    id: '3',
    title: '戶外練習',
    eventTime: createEventTime(-7, 18, 0),
    amount: '0',
    duration: '2',
    notes: '在公園練習，免費',
    createdBy: mockUsers[2],
    bookedBy: mockUsers[2],
    location: mockLocations[1],
    users: [mockUsers[0], mockUsers[2], mockUsers[3], mockUsers[4]],
    timeLabel: formatEventTimeToTimeLabel(
      createEventTime(-7, 18, 0),
      2,
    ),
    reminder3dSent: false,
    reminder1dSent: false,
    reminder0dSent: false,
    lineGroupId: 'demo-group-1',
  },
];
