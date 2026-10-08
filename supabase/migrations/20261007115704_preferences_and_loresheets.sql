-- Group 4: player preferences and loresheets.

-- Preferences, e.g. {"tooltips": false, "guidance": false}. Missing keys mean "on".
alter table public.profiles add column preferences jsonb not null default '{}'::jsonb;

-- Loresheets: the player's own notes on a location, a player character or an NPC.
create table public.loresheets (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null default auth.uid() references auth.users (id) on delete cascade,
  game          public.game not null,
  kind          text not null check (kind in ('location', 'pc', 'npc')),
  title         text not null default '' check (char_length(title) <= 200),
  character_id  uuid references public.characters (id) on delete set null,
  content       jsonb not null default '{}'::jsonb check (pg_column_size(content) < 200000),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index loresheets_owner on public.loresheets (user_id, game, updated_at desc);
create trigger loresheets_touch before update on public.loresheets
  for each row execute function public.touch_updated_at();

alter table public.loresheets enable row level security;

create policy "Loresheets are readable by their owner"
  on public.loresheets for select to authenticated using (user_id = (select auth.uid()));
create policy "Loresheets can be created by their owner"
  on public.loresheets for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and (character_id is null or exists (select 1 from public.characters c where c.id = character_id and c.user_id = (select auth.uid())))
  );
create policy "Loresheets are editable by their owner"
  on public.loresheets for update to authenticated
  using (user_id = (select auth.uid()))
  with check (
    user_id = (select auth.uid())
    and (character_id is null or exists (select 1 from public.characters c where c.id = character_id and c.user_id = (select auth.uid())))
  );
create policy "Loresheets can be deleted by their owner"
  on public.loresheets for delete to authenticated using (user_id = (select auth.uid()));
