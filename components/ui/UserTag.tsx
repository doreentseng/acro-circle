import { UserViewModel } from '@/lib/types/user';

const tagColors = [
  'bg-teal-100 text-teal-900 dark:bg-teal-900/30 dark:text-teal-200',
  'bg-orange-100 text-orange-900 dark:bg-orange-900/30 dark:text-orange-200',
  'bg-red-100 text-red-900 dark:bg-red-900/30 dark:text-red-200',
  'bg-purple-100 text-purple-900 dark:bg-purple-900/30 dark:text-purple-200',
  'bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-200',
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
