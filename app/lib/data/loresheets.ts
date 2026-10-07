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

// RLS keeps loresheets private to their owner.
export const getLoresheets = cache(async (game?: Game) => {
  const supabase = await createClient();
  let q = supabase.from('loresheets').select(COLUMNS).order('updated_at', { ascending: false });
  if (game) q = q.eq('game', game);
  const { data } = await q;
  return (data ?? []) as Loresheet[];
});

export const getLoresheet = cache(async (id: string) => {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const supabase = await createClient();
  const { data } = await supabase.from('loresheets').select(COLUMNS).eq('id', id).maybeSingle();
  return data as Loresheet | null;
});
