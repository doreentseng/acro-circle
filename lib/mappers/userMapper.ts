import type { UserRaw, UserViewModel } from '@/lib/types/user';

export function mapUser(raw: UserRaw): UserViewModel {
  return {
    id: String(raw.id),
    name: raw.name,
    username: raw.username,
  };
}
