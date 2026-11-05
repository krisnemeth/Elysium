import { getPreferences } from '@/app/lib/data/social';
import { enteredCover } from '@/app/lib/entry-cover';
import OverviewShell from '@/app/ui/overview/OverviewShell';

export default async function OverviewLayout({ children }: { children: React.ReactNode }) {
  const [cover, preferences] = await Promise.all([enteredCover(), getPreferences()]);
  return (
    <OverviewShell cover={cover} preferences={preferences}>
      {children}
    </OverviewShell>
  );
}
