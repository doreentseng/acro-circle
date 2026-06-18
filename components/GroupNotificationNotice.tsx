'use client';

import { Alert } from '@/components/ui/Alert';
import { useAuth } from '@/providers/AuthProvider';

export default function GroupNotificationNotice() {
  const { isGuest } = useAuth();
  return (
    <Alert
      title={`LINE 群組通知 ${isGuest ? '（訪客模式無此功能）' : ''}`}
      type="info"
    >
      <ul className="text-sm space-y-1 mt-1">
        <li>將於活動時間前三天、前一天及當天傳送提醒通知到群組</li>
      </ul>
    </Alert>
  );
}
