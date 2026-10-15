-- Storyteller bot personas. The persona lives in chronicles.bot (jsonb) as
-- bot -> 'persona' (archivist, nightwatch, wire, hearthkeeper or breaker).
-- Chronicles made before personas stored only a tone; give each the nearest
-- persona. The tone stays in the json, and the app falls back to it too.

update public.chronicles
   set bot = bot || jsonb_build_object(
         'persona',
         case bot ->> 'tone'
           when 'horror' then 'nightwatch'
           when 'action' then 'wire'
           else 'archivist'
         end
       )
 where bot is not null
   and not (bot ? 'persona');
