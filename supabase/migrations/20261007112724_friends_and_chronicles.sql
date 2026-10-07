-- Group 3: friends, chronicles (play groups), shared dice rolls and notes.
--
-- Rules of thumb:
-- * Every table has RLS. Cross-table checks go through small security-definer
--   helpers (search_path = '') so policies never recurse into each other.
-- * Anything that needs to look up another user (friend codes, invites) is an
--   RPC that checks the caller, so profiles never become publicly listable.

-- ------------------------------------------------------------------ friend codes

create or replace function public.new_friend_code()
returns text
language sql
volatile
set search_path = ''
as $$
  -- 8 characters without look-alikes (no 0/O, 1/I/L).
  select string_agg(substr('ABCDEFGHJKMNPQRSTUVWXYZ23456789', 1 + floor(random() * 31)::int, 1), '')
  from generate_series(1, 8);
$$;

alter table public.profiles add column friend_code text unique default public.new_friend_code();
update public.profiles set friend_code = public.new_friend_code() where friend_code is null;
alter table public.profiles alter column friend_code set not null;

-- ------------------------------------------------------------------ friendships

create table public.friendships (
  id          uuid primary key default gen_random_uuid(),
  requester   uuid not null references auth.users (id) on delete cascade,
  addressee   uuid not null references auth.users (id) on delete cascade,
  status      text not null default 'pending' check (status in ('pending', 'accepted')),
  created_at  timestamptz not null default now(),
  check (requester <> addressee)
);
create unique index friendships_pair on public.friendships (least(requester, addressee), greatest(requester, addressee));
create index friendships_addressee on public.friendships (addressee);

alter table public.friendships enable row level security;

create policy "Friendships are visible to both people"
  on public.friendships for select to authenticated
  using ((select auth.uid()) in (requester, addressee));

create policy "Requests can be accepted by the person asked"
  on public.friendships for update to authenticated
  using (addressee = (select auth.uid()))
  with check (addressee = (select auth.uid()) and status = 'accepted');

create policy "Either person can end a friendship or request"
  on public.friendships for delete to authenticated
  using ((select auth.uid()) in (requester, addressee));

create or replace function public.are_friends(a uuid, b uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.friendships f
    where f.status = 'accepted'
      and least(f.requester, f.addressee) = least(a, b)
      and greatest(f.requester, f.addressee) = greatest(a, b)
  );
$$;

-- Sends a request by friend code. Accepts straight away if they'd already asked you.
create or replace function public.send_friend_request(code text)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  me uuid := auth.uid();
  them uuid;
  existing public.friendships;
begin
  if me is null then return 'signed-out'; end if;
  select id into them from public.profiles where friend_code = upper(trim(code));
  if them is null then return 'not-found'; end if;
  if them = me then return 'self'; end if;

  select * into existing from public.friendships
  where least(requester, addressee) = least(me, them) and greatest(requester, addressee) = greatest(me, them);

  if existing.id is null then
    insert into public.friendships (requester, addressee) values (me, them);
    return 'sent';
  elsif existing.status = 'accepted' then
    return 'already-friends';
  elsif existing.requester = them then
    update public.friendships set status = 'accepted' where id = existing.id;
    return 'accepted';
  else
    return 'already-sent';
  end if;
end;
$$;

-- ------------------------------------------------------------------ chronicles

create table public.chronicles (
  id           uuid primary key default gen_random_uuid(),
  owner_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name         text not null check (char_length(name) between 1 and 120),
  game         public.game not null,
  storyteller  text not null default 'player' check (storyteller in ('player', 'bot')),
  -- The Storyteller bot's seed, setup choices and progress.
  bot          jsonb,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create trigger chronicles_touch before update on public.chronicles
  for each row execute function public.touch_updated_at();

create table public.chronicle_members (
  chronicle_id  uuid not null references public.chronicles (id) on delete cascade,
  user_id       uuid not null references auth.users (id) on delete cascade,
  role          text not null default 'player' check (role in ('storyteller', 'player')),
  status        text not null default 'invited' check (status in ('invited', 'joined')),
  character_id  uuid references public.characters (id) on delete set null,
  invited_by    uuid references auth.users (id) on delete set null,
  created_at    timestamptz not null default now(),
  primary key (chronicle_id, user_id)
);
create index chronicle_members_user on public.chronicle_members (user_id);
create index chronicle_members_character on public.chronicle_members (character_id);

alter table public.chronicles enable row level security;
alter table public.chronicle_members enable row level security;

-- Helpers (security definer, so policies can use them without recursion).
create or replace function public.chronicle_role(cid uuid)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select case when m.status = 'joined' then m.role else 'invited' end
  from public.chronicle_members m
  where m.chronicle_id = cid and m.user_id = auth.uid();
$$;

create or replace function public.is_chronicle_member(cid uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.chronicle_members m
    where m.chronicle_id = cid and m.user_id = auth.uid() and m.status = 'joined'
  );
$$;

-- A Storyteller may read the sheets their players brought to the chronicle.
create or replace function public.storyteller_can_read(char_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.chronicle_members player
    join public.chronicle_members st on st.chronicle_id = player.chronicle_id
    where player.character_id = char_id
      and player.status = 'joined'
      and st.user_id = auth.uid()
      and st.role = 'storyteller'
      and st.status = 'joined'
  );
$$;

-- Fellow members may see a character's portrait.
create or replace function public.in_same_chronicle(char_id text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.chronicle_members theirs
    join public.chronicle_members mine on mine.chronicle_id = theirs.chronicle_id
    where theirs.character_id::text = char_id
      and theirs.status = 'joined'
      and mine.user_id = auth.uid()
      and mine.status = 'joined'
  );
$$;

create policy "Chronicles are visible to their members and invitees"
  on public.chronicles for select to authenticated
  using (owner_id = (select auth.uid()) or public.chronicle_role(id) is not null);

create policy "Chronicles can be renamed by their owner"
  on public.chronicles for update to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

create policy "Chronicles can be deleted by their owner"
  on public.chronicles for delete to authenticated
  using (owner_id = (select auth.uid()));

create policy "Members see who else is in the chronicle"
  on public.chronicle_members for select to authenticated
  using (user_id = (select auth.uid()) or public.is_chronicle_member(chronicle_id));

-- Accept an invite and choose which of your own characters to bring.
create policy "Members manage their own place"
  on public.chronicle_members for update to authenticated
  using (user_id = (select auth.uid()))
  with check (
    user_id = (select auth.uid())
    and (character_id is null or exists (
      select 1 from public.characters c where c.id = character_id and c.user_id = (select auth.uid())
    ))
  );

create policy "Members can leave; owners can remove anyone"
  on public.chronicle_members for delete to authenticated
  using (
    user_id = (select auth.uid())
    or exists (select 1 from public.chronicles c where c.id = chronicle_id and c.owner_id = (select auth.uid()))
  );

-- Creating a chronicle also makes you its first member.
create or replace function public.create_chronicle(chronicle_name text, chronicle_game public.game, led_by text, bot_state jsonb)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  me uuid := auth.uid();
  new_id uuid;
begin
  if me is null then raise exception 'signed out'; end if;
  insert into public.chronicles (owner_id, name, game, storyteller, bot)
  values (me, chronicle_name, chronicle_game, led_by, case when led_by = 'bot' then bot_state end)
  returning id into new_id;
  insert into public.chronicle_members (chronicle_id, user_id, role, status, invited_by)
  values (new_id, me, case when led_by = 'player' then 'storyteller' else 'player' end, 'joined', me);
  return new_id;
end;
$$;

-- Members invite their friends.
create or replace function public.invite_to_chronicle(cid uuid, friend uuid)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  me uuid := auth.uid();
begin
  if not public.is_chronicle_member(cid) then return 'not-member'; end if;
  if not public.are_friends(me, friend) then return 'not-friends'; end if;
  insert into public.chronicle_members (chronicle_id, user_id, invited_by)
  values (cid, friend, me)
  on conflict (chronicle_id, user_id) do nothing;
  return 'invited';
end;
$$;

-- Profiles: you can see the names of your friends, people who asked to be
-- your friend, and the people you share a chronicle with.
create policy "Connected profiles are readable"
  on public.profiles for select to authenticated
  using (
    exists (
      select 1 from public.friendships f
      where (f.requester = (select auth.uid()) and f.addressee = id)
         or (f.addressee = (select auth.uid()) and f.requester = id)
    )
    or exists (
      select 1 from public.chronicle_members theirs
      where theirs.user_id = id and public.chronicle_role(theirs.chronicle_id) is not null
    )
  );

-- Characters: Storytellers can read the sheets brought to their chronicles.
create policy "Storytellers read their players' characters"
  on public.characters for select to authenticated
  using (public.storyteller_can_read(id));

-- Everyone in a chronicle sees the party: names, games, factions, portraits.
create or replace function public.chronicle_party(cid uuid)
returns table (
  user_id uuid,
  display_name text,
  role text,
  status text,
  character_id uuid,
  character_name text,
  game public.game,
  faction text,
  portrait text
)
language sql
stable
security definer
set search_path = ''
as $$
  select m.user_id, p.display_name, m.role, m.status, c.id, c.name, c.game, c.faction, c.portrait
  from public.chronicle_members m
  join public.profiles p on p.id = m.user_id
  left join public.characters c on c.id = m.character_id and c.user_id = m.user_id
  where m.chronicle_id = cid and public.chronicle_role(cid) is not null
  order by m.role = 'storyteller' desc, m.created_at;
$$;

-- ------------------------------------------------------------------ rolls and notes

create table public.chronicle_rolls (
  id              uuid primary key default gen_random_uuid(),
  chronicle_id    uuid not null references public.chronicles (id) on delete cascade,
  user_id         uuid not null default auth.uid() references auth.users (id) on delete cascade,
  character_name  text,
  game            public.game not null,
  label           text not null,
  dice            jsonb not null,
  successes       int2 not null,
  difficulty      int2 not null,
  outcome         text not null,
  created_at      timestamptz not null default now()
);
create index chronicle_rolls_recent on public.chronicle_rolls (chronicle_id, created_at desc);

alter table public.chronicle_rolls enable row level security;

create policy "Members see the chronicle's rolls"
  on public.chronicle_rolls for select to authenticated
  using (public.is_chronicle_member(chronicle_id));

create policy "Members add their own rolls"
  on public.chronicle_rolls for insert to authenticated
  with check (user_id = (select auth.uid()) and public.is_chronicle_member(chronicle_id));

create table public.chronicle_notes (
  id            uuid primary key default gen_random_uuid(),
  chronicle_id  uuid not null references public.chronicles (id) on delete cascade,
  author_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  -- note: shared notes; session: the session log; bot: the Storyteller bot's narration.
  kind          text not null default 'note' check (kind in ('note', 'session', 'bot')),
  title         text not null default '' check (char_length(title) <= 200),
  body          text not null default '' check (char_length(body) <= 20000),
  -- Notes only the Storyteller (and the author) can read.
  private       boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index chronicle_notes_recent on public.chronicle_notes (chronicle_id, created_at desc);
create trigger chronicle_notes_touch before update on public.chronicle_notes
  for each row execute function public.touch_updated_at();

alter table public.chronicle_notes enable row level security;

create policy "Members read shared notes; Storytellers read all"
  on public.chronicle_notes for select to authenticated
  using (
    public.is_chronicle_member(chronicle_id)
    and (not private or author_id = (select auth.uid()) or public.chronicle_role(chronicle_id) = 'storyteller')
  );

create policy "Members write their own notes"
  on public.chronicle_notes for insert to authenticated
  with check (author_id = (select auth.uid()) and public.is_chronicle_member(chronicle_id));

create policy "Authors edit their own notes"
  on public.chronicle_notes for update to authenticated
  using (author_id = (select auth.uid()))
  with check (author_id = (select auth.uid()));

create policy "Authors and owners delete notes"
  on public.chronicle_notes for delete to authenticated
  using (
    author_id = (select auth.uid())
    or exists (select 1 from public.chronicles c where c.id = chronicle_id and c.owner_id = (select auth.uid()))
  );

-- Live dice log and notes.
alter publication supabase_realtime add table public.chronicle_rolls, public.chronicle_notes;

-- ------------------------------------------------------------------ portraits

-- Fellow chronicle members can see each other's character portraits.
create policy "Read portraits of characters in your chronicles"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'portraits'
    and public.in_same_chronicle((storage.foldername(name))[2])
  );

-- ------------------------------------------------------------------ grants

revoke execute on function public.send_friend_request(text) from public, anon;
revoke execute on function public.create_chronicle(text, public.game, text, jsonb) from public, anon;
revoke execute on function public.invite_to_chronicle(uuid, uuid) from public, anon;
revoke execute on function public.chronicle_party(uuid) from public, anon;
grant execute on function public.send_friend_request(text) to authenticated;
grant execute on function public.create_chronicle(text, public.game, text, jsonb) to authenticated;
grant execute on function public.invite_to_chronicle(uuid, uuid) to authenticated;
grant execute on function public.chronicle_party(uuid) to authenticated;
