import { redirect } from 'next/navigation';
import { PATHNAME } from '@/lib/constants/pathname';

export default function HomePage() {
  redirect(PATHNAME.DASHBOARD);
}
