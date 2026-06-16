'use client';

import { Alert } from '@/components/ui/Alert';

export default function GroupNotificationNotice() {
  return (
    <Alert title="LINE 群組通知" type="info">
      <ul className="text-sm space-y-1 mt-1">
        <li>將於活動時間前三天、前一天及當天傳送提醒通知到群組</li>
      </ul>
    </Alert>
  );
}
