import { cache } from 'react';
import { createClient } from '@/app/lib/supabase/server';
import type { Game } from '@/app/lib/games';
import type { BotState } from '@/app/lib/storyteller/generate';
import { DEFAULT_PREFERENCES, readPreferences, type Preferences } from '@/app/lib/preferences';

export type Profile = { id: string; display_name: string; friend_code: string; preferences: Preferences };

export type Friend = {
  friendshipId: string;
  userId: string;
  name: string;
  status: 'pending' | 'accepted';
  direction: 'incoming' | 'outgoing';
};

export type Chronicle = {
  id: string;
  owner_id: string;
  name: string;
  game: Game;
  storyteller: 'player' | 'bot';
  bot: BotState | null;
  created_at: string;
  updated_at: string;
};

export type Membership = { role: 'storyteller' | 'player'; status: 'invited' | 'joined'; character_id: string | null };

export type PartyMember = {
  user_id: string;
  display_name: string;
  role: 'storyteller' | 'player';
  status: 'invited' | 'joined';
  character_id: string | null;
  character_name: string | null;
  game: Game | null;
  faction: string | null;
  portrait: string | null;
};

export type Roll = {
  id: string;
  user_id: string;
  character_name: string | null;
  game: Game;
  label: string;
  dice: { value: number; kind: 'regular' | 'special' }[];
  successes: number;
  difficulty: number;
  outcome: string;
  created_at: string;
};

export type Note = {
  id: string;
  author_id: string;
  kind: 'note' | 'session' | 'bot';
  title: string;
  body: string;
  private: boolean;
  created_at: string;
  updated_at: string;
};

const userId = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  return (data?.claims?.sub as string | undefined) ?? null;
});

export const getMe = cache(async (): Promise<Profile | null> => {
  const id = await userId();
  if (!id) return null;
  const supabase = await createClient();
  const { data } = await supabase.from('profiles').select('id, display_name, friend_code, preferences').eq('id', id).maybeSingle();
  return data ? ({ ...data, preferences: readPreferences(data.preferences) } as Profile) : null;
});

export const getPreferences = cache(async (): Promise<Preferences> => (await getMe())?.preferences ?? DEFAULT_PREFERENCES);

export const getFriends = cache(async (): Promise<Friend[]> => {
  const me = await userId();
  if (!me) return [];
  const supabase = await createClient();
  const { data: rows } = await supabase.from('friendships').select('id, requester, addressee, status').order('created_at');
  if (!rows?.length) return [];
  const others = rows.map((r) => (r.requester === me ? r.addressee : r.requester));
  const { data: profiles } = await supabase.from('profiles').select('id, display_name').in('id', others);
  const names = new Map((profiles ?? []).map((p) => [p.id, p.display_name as string]));
  return rows.map((r) => {
    const other = r.requester === me ? r.addressee : r.requester;
    return {
      friendshipId: r.id,
      userId: other,
      name: names.get(other) ?? 'Someone',
      status: r.status,
      direction: r.requester === me ? 'outgoing' : 'incoming',
    };
  });
});

export const getChronicles = cache(async () => {
  const me = await userId();
  if (!me) return [];
  const supabase = await createClient();
  const { data: chronicles } = await supabase.from('chronicles').select('*').order('updated_at', { ascending: false });
  const { data: mine } = await supabase.from('chronicle_members').select('chronicle_id, role, status, character_id').eq('user_id', me);
  const byId = new Map((mine ?? []).map((m) => [m.chronicle_id, m as Membership]));
  return ((chronicles ?? []) as Chronicle[]).map((c) => ({ chronicle: c, membership: byId.get(c.id) ?? null }));
});

export const getChronicle = cache(async (id: string) => {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const me = await userId();
  if (!me) return null;
  const supabase = await createClient();
  const { data: chronicle } = await supabase.from('chronicles').select('*').eq('id', id).maybeSingle();
  if (!chronicle) return null;
  const [{ data: party }, { data: membership }] = await Promise.all([
    supabase.rpc('chronicle_party', { cid: id }),
    supabase.from('chronicle_members').select('role, status, character_id').eq('chronicle_id', id).eq('user_id', me).maybeSingle(),
  ]);
  return {
    chronicle: chronicle as Chronicle,
    party: (party ?? []) as PartyMember[],
    membership: membership as Membership | null,
    me,
  };
});

export async function getRolls(chronicleId: string, limit = 30) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('chronicle_rolls')
    .select('*')
    .eq('chronicle_id', chronicleId)
    .order('created_at', { ascending: false })
    .limit(limit);
  return (data ?? []) as Roll[];
}

export async function getNotes(chronicleId: string) {
  const supabase = await createClient();
  const { data } = await supabase.from('chronicle_notes').select('*').eq('chronicle_id', chronicleId).order('created_at', { ascending: false });
  return (data ?? []) as Note[];
}

// Chronicles a character could share rolls with (you've joined, it's yours there).
export async function getChroniclesForCharacter(characterId: string) {
  const me = await userId();
  if (!me) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from('chronicle_members')
    .select('chronicle_id, chronicles(name)')
    .eq('user_id', me)
    .eq('status', 'joined')
    .eq('character_id', characterId);
  return (data ?? []).map((r) => ({
    id: r.chronicle_id as string,
    name: (r.chronicles as unknown as { name: string } | null)?.name ?? 'Chronicle',
  }));
}

export type Vote = { user_id: string; choice: string; created_at: string };

export async function getVotes(chronicleId: string, step: number) {
  const supabase = await createClient();
  const { data } = await supabase.from('chronicle_votes').select('user_id, choice, created_at').eq('chronicle_id', chronicleId).eq('step', step);
  return (data ?? []) as Vote[];
}
