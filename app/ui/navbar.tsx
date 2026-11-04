import SiteIsland from '@/app/ui/SiteIsland';
import { createClient } from '@/app/lib/supabase/server';
import { hasSupabase } from '@/app/lib/supabase/env';

type Props = {
  sections?: { href: string; label: string }[];
};

// The public pages' navbar (the landing, login, sign-up); past login it's the
// sidebar (app/ui/dashboard/AppShell.tsx). The surrounding [data-game] gives it
// that theme's frame (.frame in app/games.css).
export default async function Navbar({ sections = [] }: Props) {
  // Signed in: link to the vault and offer log out. Signed out: log in / sign up.
  let signedIn = false;
  if (hasSupabase) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    signedIn = Boolean(data?.claims);
  }

  return <SiteIsland sections={sections} signedIn={signedIn} />;
}
