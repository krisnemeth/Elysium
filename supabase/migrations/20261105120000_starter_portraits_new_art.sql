-- The starters move to the new character art (app/lib/starters/*.ts).
-- Portraits only: sheets stay as they are, and a copy only changes if it still
-- wears the old starter image, so a portrait a player chose is left alone.

create temporary table starter_art (key text primary key, old text not null, new text not null);

insert into starter_art (key, old, new) values
  ('vtm-trixx-laveau', '/Female1.jpg', '/art/vault/punk-vampire.webp'),
  ('vtm-blake-janssen', '/Nosferatu.jpeg', '/art/vault/storyteller.webp'),
  ('vtm-claire-voyant', '/Malkavian.jpg', '/art/cover-neon.webp'),
  ('wta-grey-fang', '/portraits/garou-crinos.webp', '/art/cover-garou.webp'),
  ('wta-rosa-vex', '/portraits/garou-punk.webp', '/art/cover-garou-2.webp'),
  ('wta-old-tom-marrow', '/portraits/garou-drifter.webp', '/art/vault/garou-biker.webp'),
  ('htr-dez-mcallister', '/portraits/hunter-flannel.webp', '/art/vault/hunter-tablet.webp'),
  ('htr-father-ruiz', '/portraits/hunter-priest.webp', '/art/cover-hunter-2.webp'),
  ('htr-vesna-kovac', '/portraits/hunter-vesna.webp', '/art/cover-hunter.webp');

update public.starter_characters s
set portrait = a.new
from starter_art a
where s.key = a.key;

-- Not an edit by the player: keep updated_at, which orders the lists and marks
-- the copies nobody has touched.
alter table public.characters disable trigger characters_touch_updated_at;

update public.characters c
set portrait = a.new
from starter_art a
where c.starter_key = a.key and c.portrait = a.old;

alter table public.characters enable trigger characters_touch_updated_at;

drop table starter_art;
