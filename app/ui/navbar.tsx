import SiteIsland from '@/app/ui/SiteIsland';
import { createClient } from '@/app/lib/supabase/server';
import { hasSupabase } from '@/app/lib/supabase/env';

type Props = {
  sections?: { href: string; label: string }[];
  themeLabels?: { light: string; dark: string };
};

// The site navbar, shared by every landing page; the surrounding
// [data-game] gives it that theme's frame (.frame in app/games.css).
export default async function Navbar({
  sections = [
    { href: '#features', label: 'Features' },
    { href: '#clans', label: 'Clans' },
  ],
  themeLabels = { light: 'Neon Nights', dark: 'Masquerade' },
}: Props) {
  // Signed in: link to the vault and offer log out. Signed out: log in / sign up.
  let signedIn = false;
  if (hasSupabase) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    signedIn = Boolean(data?.claims);
  }

  return <SiteIsland sections={sections} themeLabels={themeLabels} signedIn={signedIn} />;
}
