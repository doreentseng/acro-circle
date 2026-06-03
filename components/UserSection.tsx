import type { UserViewModel } from '@/lib/types/user';
import { UsersIcon } from '@heroicons/react/24/solid';
import SectionTitle from '@/components/ui/SectionTitle';
import UserTag from './ui/UserTag';
import { SectionSkeleton } from './ui/Skeleton';

export default function UserSection({ users }: { users: UserViewModel[] }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-5">
      <SectionTitle icon={<UsersIcon className="w-5 h-5" />} title="人員清單" />
      {users.length === 0 ? (
        <SectionSkeleton size="sm" />
      ) : (
        <div className="mt-3 flex flex-wrap gap-2 text-sm text-zinc-600">
          {users.map((u) => (
            <UserTag key={u.id} user={u} className="text-xs" />
          ))}
        </div>
      )}
    </div>
  );
}
