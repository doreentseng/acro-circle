'use client';

import { useAuth } from '@/providers/AuthProvider';
import { Alert } from '@/components/ui/Alert';

export default function GuestModeNotice() {
  const { isGuest } = useAuth();

  if (!isGuest) {
    return null;
  }

  return (
    <div className="mb-4">
      <Alert title="訪客模式提醒" type="info">
        <ul className="text-sm space-y-1 mt-1">
          <li>• 您正在使用訪客模式瀏覽示範資料</li>
          <li>• 建立的預約不會儲存到資料庫</li>
          <li>• 預約不會與 LINE 群組連通做提前通知</li>
          <li>• 重新整理頁面後，您的變更將會消失</li>
        </ul>
      </Alert>
    </div>
  );
}
