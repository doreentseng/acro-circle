import { UserViewModel } from '@/lib/types/user';

const tagColors = [
  'bg-teal-100 text-zinc-700',
  'bg-orange-100 text-zinc-700',
  'bg-red-100 text-zinc-700',
  'bg-purple-100 text-zinc-700',
  'bg-blue-100 text-zinc-700',
];

export function getTagColor(key: string): string {
  return tagColors[Number(key) - 1];
}

export default function UserTag({
  user,
  className = '',
}: {
  user: UserViewModel;
  className?: string;
}) {
  return (
    <span
      key={user.id}
      className={`px-2 py-1 rounded-full text-sm font-medium ${getTagColor(
        user.id,
      )} ${className}`}
    >
      {user.name}
    </span>
  );
}
