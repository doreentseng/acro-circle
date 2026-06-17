import type { UserViewModel } from '@/lib/types/user';
import type { LocationViewModel } from '@/lib/types/location';
import type { EventViewModel } from '@/lib/types/event';

export const mockUsers: UserViewModel[] = [
  { id: '1', name: '黃金獵犬', username: 'goldenretriever' },
  { id: '2', name: '貴賓狗', username: 'poodle' },
  { id: '3', name: '博美', username: 'pomeranian' },
  { id: '4', name: '布丁狗', username: 'pompompurin' },
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

export const mockEvents: EventViewModel[] = [
  {
    id: '1',
    title: '週末練習',
    eventTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2天後
    amount: '300',
    duration: '2',
    notes: '記得帶水和毛巾',
    createdBy: mockUsers[0],
    bookedBy: mockUsers[0],
    location: mockLocations[0],
    users: [mockUsers[0], mockUsers[1], mockUsers[2]],
    timeLabel: '2026/06/17（星期三）19:00-21:00',
    reminder3dSent: false,
    reminder1dSent: false,
    reminder0dSent: false,
    lineGroupId: 'demo-group-1',
  },
  {
    id: '2',
    title: '進階訓練',
    eventTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    amount: '400',
    duration: '3',
    notes: '高難度動作練習',
    createdBy: mockUsers[1],
    bookedBy: mockUsers[1],
    location: mockLocations[1],
    users: [mockUsers[1], mockUsers[3], mockUsers[4]],
    timeLabel: '2026/06/20（星期六）14:00-17:00',
    reminder3dSent: false,
    reminder1dSent: false,
    reminder0dSent: false,
    lineGroupId: 'demo-group-1',
  },
  {
    id: '3',
    title: '戶外練習',
    eventTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    amount: '0',
    duration: '2',
    notes: '在公園練習，免費',
    createdBy: mockUsers[2],
    bookedBy: mockUsers[2],
    location: mockLocations[1],
    users: [mockUsers[0], mockUsers[2], mockUsers[3], mockUsers[4]],
    timeLabel: '2026/06/22（星期一）10:00-12:00',
    reminder3dSent: false,
    reminder1dSent: false,
    reminder0dSent: false,
    lineGroupId: 'demo-group-1',
  },
];
