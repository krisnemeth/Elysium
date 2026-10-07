// Loresheets: a player's own write-ups of a location, a player character or
// an NPC. Not the rulebook mechanic of the same name; just the player's notes.

export type LoreKind = 'location' | 'pc' | 'npc';

export type LoreField = { key: string; label: string; hint: string; rows?: number };

export const LORE_KINDS: Record<LoreKind, { label: string; noun: string; blurb: string; fields: LoreField[] }> = {
  location: {
    label: 'Location',
    noun: 'location',
    blurb: 'A haven, a bar, a caern, a hunting ground: somewhere the story keeps coming back to.',
    fields: [
      { key: 'where', label: 'Where it is', hint: 'District, street, how you get in.', rows: 2 },
      { key: 'description', label: 'What it’s like', hint: 'What you see, hear and smell walking in.', rows: 5 },
      { key: 'control', label: 'Who holds it', hint: 'Owners, regulars, whoever is really in charge.', rows: 3 },
      { key: 'secrets', label: 'Secrets', hint: 'What most people don’t know about it.', rows: 4 },
      { key: 'hooks', label: 'Story hooks', hint: 'Trouble waiting to happen here.', rows: 4 },
      { key: 'notes', label: 'Notes', hint: 'Anything else.', rows: 4 },
    ],
  },
  pc: {
    label: 'Player character',
    noun: 'character story',
    blurb: 'The parts of a character’s life that don’t fit on the sheet: history, ties, rumours.',
    fields: [
      { key: 'history', label: 'Backstory', hint: 'Where they came from and what made them.', rows: 8 },
      { key: 'relationships', label: 'Relationships', hint: 'Allies, lovers, rivals, family, sire, pack.', rows: 5 },
      { key: 'goals', label: 'What they’re after', hint: 'Short and long-term goals.', rows: 3 },
      { key: 'rumours', label: 'What people say', hint: 'True or not.', rows: 3 },
      { key: 'secrets', label: 'Secrets', hint: 'Things only you and the Storyteller should know.', rows: 4 },
      { key: 'notes', label: 'Notes', hint: 'Anything else.', rows: 4 },
    ],
  },
  npc: {
    label: 'NPC',
    noun: 'NPC',
    blurb: 'Someone the characters met: a contact, an enemy, a face in the crowd worth remembering.',
    fields: [
      { key: 'role', label: 'Role in the story', hint: 'Contact, patron, rival, victim…', rows: 2 },
      { key: 'affiliation', label: 'Allegiance', hint: 'Clan, tribe, creed, company, or none.', rows: 2 },
      { key: 'appearance', label: 'Appearance', hint: 'How to recognise them.', rows: 3 },
      { key: 'wants', label: 'What they want', hint: 'And what they’ll do to get it.', rows: 3 },
      { key: 'relationships', label: 'Ties', hint: 'Who they know, owe or hate.', rows: 3 },
      { key: 'secrets', label: 'Secrets', hint: 'What they hide.', rows: 3 },
      { key: 'notes', label: 'Notes', hint: 'Anything else.', rows: 4 },
    ],
  },
};

export const isLoreKind = (k: string): k is LoreKind => k in LORE_KINDS;
