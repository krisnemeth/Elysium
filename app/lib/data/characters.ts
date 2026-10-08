import { cache } from 'react';
import { createClient } from '@/app/lib/supabase/server';
import type { Character } from '@/app/lib/sample-characters';
import type { ClanKey } from '@/app/lib/clans';
import { CLANS } from '@/app/lib/clans';
import { GAMES, type Game } from '@/app/lib/games';
import type { Sheet } from '@/app/lib/sheets/types';
import { isUploadedPortrait } from '@/app/lib/portraits';

export type CharacterRecord = {
  id: string;
  user_id: string;
  game: Game;
  name: string;
  faction: string | null;
  portrait: string | null;
  summary: string | null;
  status: 'draft' | 'finished';
  sheet: Sheet;
  starter_key: string | null;
  created_at: string;
  updated_at: string;
};

const COLUMNS = 'id, user_id, game, name, faction, portrait, summary, status, sheet, starter_key, created_at, updated_at';

// The card/list shape the dashboards use.
export function toCharacter(row: CharacterRecord): Character {
  const isClan = row.game === 'vampire' && row.faction && row.faction in CLANS;
  return {
    slug: row.id,
    name: row.name || 'Unnamed',
    game: row.game,
    faction: row.faction ?? '',
    clan: isClan ? (row.faction as ClanKey) : undefined,
    status: row.status,
    image: {
      src: row.portrait ?? GAMES[row.game].figure.src,
      width: 600,
      height: 800,
      unoptimized: isUploadedPortrait(row.portrait),
    },
    description: row.summary ?? '',
  };
}

// Your own characters. RLS also lets Storytellers read sheets brought to their
// chronicles, so these filter by owner; chronicles use getSharedCharacter.
const currentUser = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  return (data?.claims?.sub as string | undefined) ?? null;
});

export const getCharacters = cache(async (game?: Game) => {
  const me = await currentUser();
  if (!me) return [];
  const supabase = await createClient();
  let query = supabase.from('characters').select(COLUMNS).eq('user_id', me).order('updated_at', { ascending: false });
  if (game) query = query.eq('game', game);
  const { data, error } = await query;
  if (error) throw new Error(`Could not load characters: ${error.message}`);
  return (data ?? []) as CharacterRecord[];
});

export const getCharacter = cache(async (id: string) => {
  // Not a UUID: treat as not found rather than erroring.
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const me = await currentUser();
  if (!me) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.from('characters').select(COLUMNS).eq('id', id).eq('user_id', me).maybeSingle();
  if (error) throw new Error(`Could not load character: ${error.message}`);
  return data as CharacterRecord | null;
});

// A sheet you can read as a chronicle's Storyteller (RLS decides).
export const getSharedCharacter = cache(async (id: string) => {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.from('characters').select(COLUMNS).eq('id', id).maybeSingle();
  if (error) throw new Error(`Could not load character: ${error.message}`);
  return data as CharacterRecord | null;
});
