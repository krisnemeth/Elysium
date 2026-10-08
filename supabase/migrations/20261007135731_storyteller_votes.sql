-- Group decisions for the Storyteller bot: every joined member votes on how
-- the story continues. When everyone has voted (or the chronicle's creator
-- calls it), the most-voted choice wins; ties go to the creator's vote, then
-- to whichever tied choice was picked first.
--
-- Choices: the four approaches, or 'search' to look for clues without moving
-- on (at most two searches per act; the app enforces which are on offer).

create table public.chronicle_votes (
  chronicle_id  uuid not null references public.chronicles (id) on delete cascade,
  user_id       uuid not null default auth.uid() references auth.users (id) on delete cascade,
  step          int not null,
  choice        text not null check (choice in ('talk', 'dig', 'sneak', 'force', 'search')),
  created_at    timestamptz not null default now(),
  primary key (chronicle_id, user_id, step)
);

alter table public.chronicle_votes enable row level security;

create policy "Members see the votes"
  on public.chronicle_votes for select to authenticated
  using (public.is_chronicle_member(chronicle_id));

alter publication supabase_realtime add table public.chronicle_votes;

-- Applies the winning choice for `step`, if the story is still at that step.
create or replace function public.resolve_vote(cid uuid, at_step int)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  owner uuid;
  winner text;
begin
  select owner_id into owner from public.chronicles where id = cid and storyteller = 'bot'
    and jsonb_array_length(coalesce(bot -> 'path', '[]'::jsonb)) = at_step;
  if owner is null then return null; end if;

  select v.choice into winner
  from public.chronicle_votes v
  where v.chronicle_id = cid and v.step = at_step
  group by v.choice
  order by count(*) desc,
           bool_or(v.user_id = owner) desc,
           min(v.created_at)
  limit 1;
  if winner is null then return null; end if;

  update public.chronicles
     set bot = jsonb_set(bot, '{path}', coalesce(bot -> 'path', '[]'::jsonb) || to_jsonb(winner))
   where id = cid;
  return winner;
end;
$$;

-- Casts (or changes) the caller's vote. Returns the winning choice once
-- everyone has voted, otherwise null.
create or replace function public.cast_vote(cid uuid, at_step int, pick text)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  members int;
  votes int;
begin
  if not public.is_chronicle_member(cid) then return null; end if;
  if pick not in ('talk', 'dig', 'sneak', 'force', 'search') then return null; end if;
  if not exists (
    select 1 from public.chronicles
    where id = cid and storyteller = 'bot' and jsonb_array_length(coalesce(bot -> 'path', '[]'::jsonb)) = at_step
  ) then return null; end if;

  insert into public.chronicle_votes (chronicle_id, user_id, step, choice)
  values (cid, auth.uid(), at_step, pick)
  on conflict (chronicle_id, user_id, step) do update set choice = excluded.choice, created_at = now();

  select count(*) into members from public.chronicle_members where chronicle_id = cid and status = 'joined';
  select count(*) into votes from public.chronicle_votes where chronicle_id = cid and step = at_step;
  if votes >= members then return public.resolve_vote(cid, at_step); end if;
  return null;
end;
$$;

-- The chronicle's creator can end the vote early.
create or replace function public.call_vote(cid uuid, at_step int)
returns text
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (select 1 from public.chronicles where id = cid and owner_id = auth.uid()) then return null; end if;
  return public.resolve_vote(cid, at_step);
end;
$$;

-- Voting replaces first-click-wins.
drop function if exists public.advance_bot(uuid, int, text);

revoke execute on function public.resolve_vote(uuid, int) from public, anon, authenticated;
revoke execute on function public.cast_vote(uuid, int, text) from public, anon;
revoke execute on function public.call_vote(uuid, int) from public, anon;
grant execute on function public.cast_vote(uuid, int, text) to authenticated;
grant execute on function public.call_vote(uuid, int) to authenticated;
