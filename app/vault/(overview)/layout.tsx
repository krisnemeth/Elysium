import { getFriends, getPreferences } from '@/app/lib/data/social';
import NeutralShell from '@/app/ui/neutral/NeutralShell';

// The pages where all three games meet stand on neutral ground.
export default async function OverviewLayout({ children }: { children: React.ReactNode }) {
  const [preferences, friends] = await Promise.all([getPreferences(), getFriends()]);
  const friendRequests = friends.filter((f) => f.status === 'pending' && f.direction === 'incoming').length;
  return (
    <NeutralShell preferences={preferences} friendRequests={friendRequests}>
      {children}
    </NeutralShell>
  );
}
