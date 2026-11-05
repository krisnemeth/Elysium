import { getContinue } from '@/app/lib/continue';
import { getFriends, getPreferences } from '@/app/lib/data/social';
import { enteredCover } from '@/app/lib/entry-cover';
import OverviewShell from '@/app/ui/overview/OverviewShell';

export default async function OverviewLayout({ children }: { children: React.ReactNode }) {
  const [cover, preferences, resume, friends] = await Promise.all([enteredCover(), getPreferences(), getContinue(), getFriends()]);
  const friendRequests = friends.filter((f) => f.status === 'pending' && f.direction === 'incoming').length;
  return (
    <OverviewShell cover={cover} preferences={preferences} resume={resume} friendRequests={friendRequests}>
      {children}
    </OverviewShell>
  );
}
