-- Loresheet images.
-- An uploaded picture lives in the existing private `portraits` bucket at
-- <user id>/<loresheet id>/<file>, the same shape as character portraits, so the
-- bucket's per-user policies and /media/portraits/... already cover it. The
-- column holds that route (/media/portraits/<user>/<loresheet>/<file>), or null.

alter table public.loresheets
  add column image text
  check (image is null or (image like '/media/portraits/%' and char_length(image) <= 300));
