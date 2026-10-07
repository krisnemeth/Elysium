'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/app/lib/supabase/server';
import { isGame, type Game } from '@/app/lib/games';
import { TONES, SETTINGS, type Approach, type SettingKind, type Tone } from '@/app/lib/storyteller/content';
import { ACT_COUNT, newBotState, sceneFor, type BotState } from '@/app/lib/storyteller/generate';
import type { RollResult } from '@/app/lib/dice/rules';

export type ActionState = { ok?: boolean; error?: string; message?: string };

const chroniclePath = (id: string) => `/vault/chronicles/${id}`;

// ------------------------------------------------------------------ profile & friends

export async function updateDisplayName(_: ActionState, form: FormData): Promise<ActionState> {
  const name = String(form.get('display_name') ?? '').trim();
  if (name.length < 1 || name.length > 40) return { error: 'Use 1 to 40 characters.' };
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims) return { error: 'You’re signed out.' };
  const { error } = await supabase.from('profiles').update({ display_name: name }).eq('id', claims.claims.sub);
  if (error) return { error: 'Couldn’t save your name.' };
  revalidatePath('/vault', 'layout');
  return { ok: true, message: 'Saved.' };
}

const FRIEND_MESSAGES: Record<string, ActionState> = {
  sent: { ok: true, message: 'Request sent. They’ll see it next time they open Friends.' },
  accepted: { ok: true, message: 'They had already asked you. You’re now friends.' },
  'already-friends': { error: 'You’re already friends.' },
  'already-sent': { error: 'You’ve already sent them a request.' },
  'not-found': { error: 'No one has that friend code. Check it and try again.' },
  self: { error: 'That’s your own code.' },
  'signed-out': { error: 'You’re signed out.' },
};

export async function sendFriendRequest(_: ActionState, form: FormData): Promise<ActionState> {
  const code = String(form.get('code') ?? '').replace(/[\s-]/g, '').toUpperCase();
  if (!/^[A-Z0-9]{8}$/.test(code)) return { error: 'Friend codes are 8 letters and numbers.' };
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('send_friend_request', { code });
  if (error) return { error: 'Couldn’t send the request. Try again.' };
  revalidatePath('/vault/friends');
  return FRIEND_MESSAGES[data as string] ?? { error: 'Something went wrong.' };
}

export async function acceptFriend(friendshipId: string) {
  const supabase = await createClient();
  await supabase.from('friendships').update({ status: 'accepted' }).eq('id', friendshipId);
  revalidatePath('/vault/friends');
}

export async function removeFriend(friendshipId: string) {
  const supabase = await createClient();
  await supabase.from('friendships').delete().eq('id', friendshipId);
  revalidatePath('/vault/friends');
}

export async function savePreferences(_: ActionState, form: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims) return { error: 'You’re signed out.' };
  const preferences = { tooltips: form.get('tooltips') === 'on', guidance: form.get('guidance') === 'on' };
  const { error } = await supabase.from('profiles').update({ preferences }).eq('id', claims.claims.sub);
  if (error) return { error: 'Couldn’t save your settings.' };
  revalidatePath('/vault', 'layout');
  return { ok: true, message: 'Settings saved.' };
}

// ------------------------------------------------------------------ chronicles

export async function createChronicle(_: ActionState, form: FormData): Promise<ActionState> {
  const name = String(form.get('name') ?? '').trim();
  const game = String(form.get('game') ?? '');
  const ledBy = form.get('storyteller') === 'bot' ? 'bot' : 'player';
  if (!name || name.length > 120) return { error: 'Give the chronicle a name (up to 120 characters).' };
  if (!isGame(game)) return { error: 'Choose a game.' };

  let bot: BotState | null = null;
  if (ledBy === 'bot') {
    const tone = String(form.get('tone'));
    const setting = String(form.get('setting'));
    if (!(tone in TONES) || !(setting in SETTINGS)) return { error: 'Choose a tone and a setting for the Storyteller bot.' };
    bot = newBotState({ tone: tone as Tone, setting: setting as SettingKind, focus: game });
  }

  const supabase = await createClient();
  const { data: id, error } = await supabase.rpc('create_chronicle', {
    chronicle_name: name,
    chronicle_game: game,
    led_by: ledBy,
    bot_state: bot,
  });
  if (error || !id) return { error: 'Couldn’t create the chronicle. Try again.' };

  if (bot) {
    // The bot opens the first scene in the session log.
    const scene = sceneFor(bot, 0);
    await supabase.from('chronicle_notes').insert({ chronicle_id: id, kind: 'bot', title: scene.title, body: scene.narration.join('\n\n') });
  }
  revalidatePath('/vault/chronicles');
  redirect(chroniclePath(id as string));
}

export async function renameChronicle(id: string, name: string) {
  const trimmed = name.trim();
  if (!trimmed || trimmed.length > 120) return;
  const supabase = await createClient();
  await supabase.from('chronicles').update({ name: trimmed }).eq('id', id);
  revalidatePath(chroniclePath(id));
}

export async function deleteChronicle(id: string) {
  const supabase = await createClient();
  await supabase.from('chronicles').delete().eq('id', id);
  revalidatePath('/vault/chronicles');
  redirect('/vault/chronicles');
}

export async function inviteFriend(chronicleId: string, friendId: string): Promise<ActionState> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('invite_to_chronicle', { cid: chronicleId, friend: friendId });
  if (error || data !== 'invited') return { error: 'Couldn’t invite them.' };
  revalidatePath(chroniclePath(chronicleId));
  return { ok: true };
}

export async function respondToInvite(chronicleId: string, accept: boolean) {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims) return;
  const me = claims.claims.sub;
  if (accept) await supabase.from('chronicle_members').update({ status: 'joined' }).eq('chronicle_id', chronicleId).eq('user_id', me);
  else await supabase.from('chronicle_members').delete().eq('chronicle_id', chronicleId).eq('user_id', me);
  revalidatePath('/vault/chronicles');
  if (accept) redirect(chroniclePath(chronicleId));
}

export async function leaveChronicle(chronicleId: string) {
  await respondToInvite(chronicleId, false);
  redirect('/vault/chronicles');
}

export async function removeMember(chronicleId: string, userId: string) {
  const supabase = await createClient();
  await supabase.from('chronicle_members').delete().eq('chronicle_id', chronicleId).eq('user_id', userId);
  revalidatePath(chroniclePath(chronicleId));
}

export async function setChronicleCharacter(chronicleId: string, characterId: string | null): Promise<ActionState> {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims) return { error: 'You’re signed out.' };
  const { error } = await supabase
    .from('chronicle_members')
    .update({ character_id: characterId })
    .eq('chronicle_id', chronicleId)
    .eq('user_id', claims.claims.sub);
  if (error) return { error: 'Couldn’t bring that character.' };
  revalidatePath(chroniclePath(chronicleId));
  return { ok: true };
}

// ------------------------------------------------------------------ rolls & notes

export async function shareRoll(chronicleId: string, game: Game, characterName: string, label: string, roll: RollResult, difficulty: number) {
  if (!isGame(game) || roll.dice.length > 40) return { ok: false as const };
  const supabase = await createClient();
  const { error } = await supabase.from('chronicle_rolls').insert({
    chronicle_id: chronicleId,
    character_name: characterName.slice(0, 120),
    game,
    label: label.slice(0, 200),
    dice: roll.dice.map((d) => ({ value: Math.max(1, Math.min(10, Math.round(d.value))), kind: d.kind === 'special' ? 'special' : 'regular' })),
    successes: roll.successes,
    difficulty,
    outcome: roll.outcome,
  });
  return { ok: !error };
}

export async function addNote(chronicleId: string, _: ActionState, form: FormData): Promise<ActionState> {
  const title = String(form.get('title') ?? '').trim().slice(0, 200);
  const body = String(form.get('body') ?? '').trim();
  const kind = form.get('kind') === 'session' ? 'session' : 'note';
  const isPrivate = form.get('private') === 'on';
  if (!body) return { error: 'Write something first.' };
  if (body.length > 20000) return { error: 'That’s too long for one note.' };
  const supabase = await createClient();
  const { error } = await supabase.from('chronicle_notes').insert({ chronicle_id: chronicleId, kind, title, body, private: isPrivate });
  if (error) return { error: 'Couldn’t save the note.' };
  revalidatePath(chroniclePath(chronicleId));
  return { ok: true, message: 'Added.' };
}

export async function deleteNote(chronicleId: string, noteId: string) {
  const supabase = await createClient();
  await supabase.from('chronicle_notes').delete().eq('id', noteId);
  revalidatePath(chroniclePath(chronicleId));
}

// ------------------------------------------------------------------ Storyteller bot

export async function chooseBotPath(chronicleId: string, expected: number, choice: Approach): Promise<ActionState> {
  const supabase = await createClient();
  const { data: chronicle } = await supabase.from('chronicles').select('bot, storyteller').eq('id', chronicleId).maybeSingle();
  const bot = chronicle?.bot as BotState | null;
  if (!bot || chronicle?.storyteller !== 'bot') return { error: 'This chronicle has no Storyteller bot.' };
  if (bot.path.length !== expected) return { error: 'Someone else chose first. Here’s where the story went.' };
  if (!sceneFor(bot).choices.some((c) => c.id === choice)) return { error: 'That isn’t one of the options.' };

  const { data: advanced } = await supabase.rpc('advance_bot', { cid: chronicleId, expected, choice });
  if (!advanced) return { error: 'Someone else chose first. Here’s where the story went.' };

  const next: BotState = { ...bot, path: [...bot.path, choice] };
  const scene = sceneFor(next);
  await supabase.from('chronicle_notes').insert({
    chronicle_id: chronicleId,
    kind: 'bot',
    title: next.path.length >= ACT_COUNT - 1 ? `${scene.title} · The end` : scene.title,
    body: scene.narration.join('\n\n'),
  });
  revalidatePath(chroniclePath(chronicleId));
  return { ok: true };
}
