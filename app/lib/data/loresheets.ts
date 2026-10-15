import { cache } from 'react';
import { createClient } from '@/app/lib/supabase/server';
import type { Game } from '@/app/lib/games';
import type { LoreKind } from '@/app/lib/loresheets';

export type Loresheet = {
  id: string;
  game: Game;
  kind: LoreKind;
  title: string;
  character_id: string | null;
  content: Record<string, string>;
  created_at: string;
  updated_at: string;
};

const COLUMNS = 'id, game, kind, title, character_id, content, created_at, updated_at';

// Your own loresheets. RLS also lets chronicle members read the ones shared
// with them, so these filter by owner; chronicles use getSharedLoresheets.
const currentUser = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  return (data?.claims?.sub as string | undefined) ?? null;
});

export const getLoresheets = cache(async (game?: Game) => {
  const me = await currentUser();
  if (!me) return [];
  const supabase = await createClient();
  let q = supabase.from('loresheets').select(COLUMNS).eq('user_id', me).order('updated_at', { ascending: false });
  if (game) q = q.eq('game', game);
  const { data } = await q;
  return (data ?? []) as Loresheet[];
});

export const getLoresheet = cache(async (id: string) => {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const me = await currentUser();
  if (!me) return null;
  const supabase = await createClient();
  const { data } = await supabase.from('loresheets').select(COLUMNS).eq('id', id).eq('user_id', me).maybeSingle();
  return data as Loresheet | null;
});

// ------------------------------------------------------------------ sharing

// The chronicles one of your loresheets is shared with.
export const getLoresheetShares = cache(async (loresheetId: string) => {
  const supabase = await createClient();
  const { data } = await supabase.from('chronicle_loresheets').select('chronicle_id').eq('loresheet_id', loresheetId);
  return (data ?? []).map((r) => r.chronicle_id as string);
});

export type SharedLoresheet = Loresheet & { shared_by: string };

// What the members of a chronicle have shared with it (RLS hides the shares of
// anyone who has left).
export async function getSharedLoresheets(chronicleId: string): Promise<SharedLoresheet[]> {
  const supabase = await createClient();
  const { data: shares } = await supabase.from('chronicle_loresheets').select('loresheet_id, shared_by').eq('chronicle_id', chronicleId);
  if (!shares?.length) return [];
  const { data } = await supabase.from('loresheets').select(COLUMNS).in('id', shares.map((s) => s.loresheet_id)).order('updated_at', { ascending: false });
  const by = new Map(shares.map((s) => [s.loresheet_id as string, s.shared_by as string]));
  return ((data ?? []) as Loresheet[]).map((l) => ({ ...l, shared_by: by.get(l.id) ?? '' }));
}
