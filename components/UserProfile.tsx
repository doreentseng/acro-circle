'use client';

import { useAuth } from '@/providers/AuthProvider';
import UserTag from '@/components/ui/UserTag';
import { linkClass } from '@/lib/styles/button';
import { useRouter } from 'next/navigation';
import { PATHNAME } from '@/lib/constants/pathname';

export default function UserProfile() {
  const router = useRouter();
  const { currentUser, isGuest, logout } = useAuth();

  const handleLogout = async () => {
    logout();
    router.replace(PATHNAME.LOGIN);
  };

  console.warn(currentUser);
  if (!currentUser) {
    return null;
  }

  return (
    <div
      className="md:w-[250px] w-full max-w-full mx-auto 
        flex items-center justify-between
        gap-4 mb-4 px-4 py-2 text-xs
        bg-zinc-100 dark:bg-zinc-800 rounded-lg
      "
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <UserTag user={currentUser} className="text-xs" />
          {isGuest && (
            <span className="px-2 py-0.5 text-xs bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300 rounded-full">
              訪客模式
            </span>
          )}
        </div>
        <span className="text-zinc-400 dark:text-zinc-400">
          @{currentUser.username}
        </span>
      </div>
      <div>
        <button
          type="button"
          className={'flex justify-between ' + linkClass}
          onClick={handleLogout}
        >
          登出
        </button>
      </div>
    </div>
  );
}
