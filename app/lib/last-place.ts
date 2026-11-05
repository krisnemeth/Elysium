// Where you last were, for Continue: a character's sheet, editor or play mode, or a chronicle's table.
export const LAST_PLACE_COOKIE = 'elysium-last-place';

const PLACE = /^\/vault\/(?:(?:vampire|werewolf|hunter)\/characters\/([^/]+)(?:\/(?:edit|play))?|chronicles\/([^/]+))\/?$/;

export function parsePlace(path: string | undefined): { character?: string; chronicle?: string } | null {
  const match = path?.match(PLACE);
  return match ? { character: match[1], chronicle: match[2] } : null;
}
