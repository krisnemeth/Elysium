-- Accounts and characters for Elysium.
--
-- One `characters` table serves all three games: shared columns for what the
-- app lists and filters by, and a `sheet` JSONB column for the game-specific
-- sheet. Every row belongs to one user, enforced by row-level security.

create type public.game as enum ('vampire', 'werewolf', 'hunter');
create type public.character_status as enum ('draft', 'finished');

-- ------------------------------------------------------------------ profiles

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are readable by their owner"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

create policy "Profiles are editable by their owner"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- ---------------------------------------------------------------- characters

create table public.characters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  game public.game not null,
  name text not null default '',
  -- Vampire clan key, Werewolf tribe or Hunter creed.
  faction text,
  portrait text,
  summary text,
  status public.character_status not null default 'draft',
  sheet jsonb not null default '{}'::jsonb,
  -- Which starter this was copied from, if any.
  starter_key text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index characters_user_game_idx on public.characters (user_id, game, updated_at desc);

alter table public.characters enable row level security;

create policy "Characters are readable by their owner"
  on public.characters for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Characters can be created by their owner"
  on public.characters for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Characters are editable by their owner"
  on public.characters for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Characters can be deleted by their owner"
  on public.characters for delete to authenticated
  using ((select auth.uid()) = user_id);

create function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger characters_touch_updated_at
  before update on public.characters
  for each row execute function public.touch_updated_at();

-- -------------------------------------------------------- starter characters

-- Ready-made characters copied into every new account. Not readable by
-- clients; only the signup trigger uses them.
create table public.starter_characters (
  key text primary key,
  game public.game not null,
  sort int not null default 0,
  name text not null,
  faction text,
  portrait text,
  summary text,
  sheet jsonb not null default '{}'::jsonb
);

alter table public.starter_characters enable row level security;

-- ------------------------------------------------------------ signup trigger

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'display_name',
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(new.email, '@', 1)
    )
  );

  insert into public.characters (user_id, game, name, faction, portrait, summary, status, sheet, starter_key)
  select new.id, s.game, s.name, s.faction, s.portrait, s.summary, 'finished', s.sheet, s.key
  from public.starter_characters s
  order by s.game, s.sort;

  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
