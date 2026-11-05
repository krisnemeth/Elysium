import type { Metadata } from 'next';
import FriendsPage from '@/app/ui/social/FriendsPage';

export const metadata: Metadata = { title: 'Friends' };

export default function Friends() {
  return <FriendsPage />;
}
