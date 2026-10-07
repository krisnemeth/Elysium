-- Any member of a bot-led chronicle may choose how the story continues.
-- `expected` is how many choices the caller saw; if someone else chose first,
-- nothing changes and the caller gets false (no double-advancing).
create or replace function public.advance_bot(cid uuid, expected int, choice text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  updated int;
begin
  if not public.is_chronicle_member(cid) then return false; end if;
  if choice not in ('talk', 'dig', 'sneak', 'force') then return false; end if;
  update public.chronicles
     set bot = jsonb_set(bot, '{path}', coalesce(bot -> 'path', '[]'::jsonb) || to_jsonb(choice))
   where id = cid
     and storyteller = 'bot'
     and jsonb_array_length(coalesce(bot -> 'path', '[]'::jsonb)) = expected
     and expected < 4;
  get diagnostics updated = row_count;
  return updated = 1;
end;
$$;

revoke execute on function public.advance_bot(uuid, int, text) from public, anon;
grant execute on function public.advance_bot(uuid, int, text) to authenticated;
