// Story material for the Storyteller bot.
//
// DARK PACK RULE: everything in this file is original writing for Elysium.
// The agreement allows bots "provided that they do not contain verbatim
// quotations from World of Darkness products, including books". So:
// - never copy or closely paraphrase rulebook text, sample chronicles,
//   power/clan/tribe/creed descriptions or fiction;
// - NPCs are original; never use canon named characters;
// - game terms (clan, tribe and creed names, Hunger, Rage, Desperation) and
//   short dice-pool suggestions are fine.
// See plans/dark-pack-compliance.md before adding anything here.

import type { Game } from '@/app/lib/games';
import { CREEDS, TRIBES } from '@/app/lib/factions';

export type Tone = 'intrigue' | 'horror' | 'action';
export type SettingKind = 'city' | 'town' | 'wilds';
export type Approach = 'talk' | 'dig' | 'sneak' | 'force';

export const TONES: Record<Tone, { label: string; blurb: string }> = {
  intrigue: { label: 'Intrigue', blurb: 'Favours, lies and whose side anyone is really on.' },
  horror: { label: 'Horror', blurb: 'Slow dread, wrong details and things best left unopened.' },
  action: { label: 'Action', blurb: 'Chases, ambushes and nights that end in a fight.' },
};

export const SETTINGS: Record<SettingKind, { label: string; blurb: string; districts: string[]; places: string[] }> = {
  city: {
    label: 'The city',
    blurb: 'Neon, rain and too many people to notice who goes missing.',
    districts: ['the Saltmarket', 'Cinder Row', 'the Glasshouse Quarter', 'Low Haddon', 'the Weir'],
    places: [
      'a flooded underpass where the river fog never quite lifts',
      'an all-night laundromat whose owner has not been seen to sleep in years',
      'the top floor of a car park, sodium lights humming over empty bays',
      'a members-only bar behind a door with no handle on the outside',
      'a shuttered cinema still showing the same film to nobody at 3 a.m.',
      'a hospital loading bay where the ambulances never seem to leave',
    ],
  },
  town: {
    label: 'A small town',
    blurb: 'Everyone knows everyone, and everyone is keeping something.',
    districts: ['Hollin Cross', 'Marrow Green', 'Stillwater', 'Kettle End'],
    places: [
      'a church hall that smells of damp hymn books and fresh paint over something older',
      'the last pub on the high street, where the regulars stop talking when you walk in',
      'a caravan park on the edge of town with one caravan nobody admits to owning',
      'a primary school closed for the summer, its windows taped over from the inside',
      'the old quarry, fenced off after an accident nobody will describe',
    ],
  },
  wilds: {
    label: 'The wilds',
    blurb: 'Forest roads, dead phone signal and older things than people.',
    districts: ['Corrie Wood', 'the Black Ridge', 'Fennick Moss', 'Annan Glen'],
    places: [
      'a logging road that ends at a gate somebody welded shut',
      'a bothy with fresh ash in the grate and no footprints outside',
      'a lochside boathouse where the water is warmer than it should be',
      'a ring of felled trees, cut clean, every stump facing inwards',
      'a disused rail tunnel that breathes out cold air on a still night',
    ],
  },
};

// Original threats, one set per focus game. `culprit` is a role filled by an NPC.
export type Threat = {
  title: string;
  premise: string; // {district}, {place}, {culprit}, {patron} are filled in
  stakes: string;
  culpritGame: Game | 'mortal';
  climax: string;
};

export const THREATS: Record<Game, Threat[]> = {
  vampire: [
    {
      title: 'Bad Blood',
      premise:
        'Something is being sold in {district}. The mortals who take it feel wonderful for a week. The Kindred who feed on them lose whole nights and wake somewhere else. {patron} wants to know who is cooking it before the court decides the answer is you.',
      stakes: 'If nobody stops it, the herd turns poisonous and the court starts looking for someone to blame.',
      culpritGame: 'vampire',
      climax: '{place}, where the next batch is being bottled',
    },
    {
      title: 'Ashes at Dawn',
      premise:
        'Three Kindred of {district} have been found staked and left where the sunrise would find them, never twice in the same street. {patron} has a list of who might be next, and your names are on it.',
      stakes: 'Every night the killer stays free, the domain grows more paranoid and more dangerous.',
      culpritGame: 'hunter',
      climax: '{place}, chosen because the first light reaches it early',
    },
    {
      title: 'The Borrowed Face',
      premise:
        'A fledgling with no sire anyone will claim has turned up in {district}, wearing a face that a respected elder last saw in a mirror two centuries ago. {patron} wants the newcomer explained, quietly.',
      stakes: 'Whoever is behind the fledgling is testing how far the court will bend.',
      culpritGame: 'vampire',
      climax: '{place}, where the fledgling was first seen',
    },
  ],
  werewolf: [
    {
      title: 'The Quiet Grove',
      premise:
        'A firm nobody has heard of has fenced off a grove in {district}. Since then the spirits there have gone silent, and the birds have stopped landing. {patron} asks the pack to find out what is being built behind the fence.',
      stakes: 'If the grove dies, the pack loses a place of power and gains a wound in the land.',
      culpritGame: 'mortal',
      climax: '{place}, beside the fence line',
    },
    {
      title: 'An Empty Collar',
      premise:
        'The old guardian of a sacred place near {district} has vanished. Its collar of braided wire was found hanging on a signpost, neatly, as if returned. {patron} fears a hunter has learned where the pack gathers.',
      stakes: 'If the gathering place is known, everyone who uses it is in danger.',
      culpritGame: 'hunter',
      climax: '{place}, where the guardian was last tracked',
    },
    {
      title: 'Calm Water',
      premise:
        'A wellness retreat has opened in {district}. Guests come home calm, polite and strangely empty, and they smell faintly of something rotten under the lavender. {patron} lost a cousin to it last month.',
      stakes: 'The calm is spreading through families, and it is starting to reach Kinfolk.',
      culpritGame: 'mortal',
      climax: '{place}, during the retreat’s midnight session',
    },
  ],
  hunter: [
    {
      title: 'The Same Face',
      premise:
        'Missing-person posters are going up all over {district}. Every one shows a different name, and every one shows the same face, a little older each time. {patron} pulled one down and found a second poster underneath.',
      stakes: 'Someone is collecting people, and the posters are a countdown.',
      culpritGame: 'vampire',
      climax: '{place}, where the posters are printed',
    },
    {
      title: 'Night Shift',
      premise:
        'The night shift at the hospital in {district} keeps losing blood bags and gaining patients who are on no list. {patron} works there and has started taking photos. Most of them come out blurred.',
      stakes: 'Whatever is feeding there is getting bolder, and staff are starting to disappear.',
      culpritGame: 'vampire',
      climax: '{place}, between two and four in the morning',
    },
    {
      title: 'Teeth in the Dark',
      premise:
        'Livestock torn apart. A hiker who came back wrong. Paw prints that become footprints halfway across a field in {district}. {patron} has a rifle, silver from a pawn shop, and no idea what she is really facing.',
      stakes: 'Hunters who guess wrong here start a war nobody can win.',
      culpritGame: 'werewolf',
      climax: '{place}, under a bright moon',
    },
  ],
};

// Original twists for the third act.
export const TWISTS: string[] = [
  '{patron} has been feeding the problem all along, and needed outsiders to take the blame.',
  '{rival} and {culprit} are working together, each sure they are using the other.',
  'The first victim is not a victim. {victim} arranged the whole thing to vanish from someone worse.',
  'There are two culprits. The one you have been chasing is covering for the other.',
  'Someone in your own circle has been passing everything you learn to {culprit}.',
  '{culprit} is not the source, only the one who opened the door. Something else came through.',
];

// Names for original NPCs. Mixed origins; none belong to canon characters.
export const FIRST_NAMES = [
  'Ailsa', 'Bram', 'Calla', 'Dorian', 'Effie', 'Fergus', 'Greer', 'Hollis', 'Idris', 'Juno', 'Kit', 'Lorne',
  'Maren', 'Nico', 'Orla', 'Pim', 'Quill', 'Rhona', 'Saoirse', 'Tamsin', 'Ulla', 'Vaughn', 'Wren', 'Yusuf', 'Zora',
  'Anouk', 'Benedek', 'Chidi', 'Dalia', 'Eitan', 'Farah', 'Gideon', 'Hana', 'Ilse', 'Jonah', 'Kasia', 'Leif',
];
export const LAST_NAMES = [
  'Ashdown', 'Blackwood', 'Carrick', 'Dunmore', 'Ellery', 'Fairlie', 'Galloway', 'Halloran', 'Innes', 'Keir',
  'Lennox', 'Moffat', 'Nairn', 'Ormsby', 'Pryce', 'Quarrie', 'Rennick', 'Sorley', 'Tait', 'Vance', 'Whitlaw',
  'Abara', 'Brodeur', 'Castellan', 'Draganov', 'Esposito', 'Farkas', 'Gallo', 'Haddad', 'Ivers', 'Juhász',
];

// Affiliations by game. Only names of clans, tribes and creeds (game terms).
export const AFFILIATIONS: Record<Game | 'mortal', string[]> = {
  vampire: ['Brujah', 'Gangrel', 'Malkavian', 'Nosferatu', 'Toreador', 'Tremere', 'Ventrue', 'Banu Haqim', 'Lasombra', 'The Ministry', 'Caitiff'],
  werewolf: [...TRIBES],
  hunter: [...CREEDS],
  mortal: ['a nurse', 'a journalist', 'a property developer', 'a police sergeant', 'a priest', 'a security guard', 'a student', 'a taxi driver'],
};

export type Role = 'patron' | 'culprit' | 'rival' | 'victim' | 'informant';

export const ROLE_LABELS: Record<Role, string> = {
  patron: 'Patron',
  culprit: 'The one behind it',
  rival: 'Rival',
  victim: 'Caught in the middle',
  informant: 'Informant',
};

export const WANTS: string[] = [
  'to be owed a favour by everyone in the room',
  'to get out of the city before the month is over',
  'revenge for something done decades ago',
  'to keep a younger sibling out of all this',
  'proof that they were right all along',
  'a quiet life, and they will hurt people to keep it',
  'to be taken seriously by people who laugh at them',
  'enough money to disappear',
  'to protect a place that matters to them',
  'to find out what happened to a friend',
];

export const SECRETS: string[] = [
  'is in debt to someone far more dangerous than they let on',
  'was there the night it all started, and ran',
  'has been lying about who they work for',
  'already knows who is behind it',
  'is being blackmailed with a photograph',
  'once did exactly what the culprit is doing now',
  'is far older than they look',
  'has a hidden way in and out of the climax location',
];

export const LOOKS: string[] = [
  'a charity-shop suit and very expensive shoes',
  'a voice so soft people lean in without meaning to',
  'nicotine-yellow fingers that never stop moving',
  'a laugh that comes a beat too late',
  'mud on their boots in every season',
  'a wedding ring worn on a chain around the neck',
  'a scar through one eyebrow they touch when lying',
  'the stillness of someone used to being watched',
];

// Act structure. Narration templates are original; placeholders are filled in.
export const ACTS = [
  { key: 'hook', title: 'The Hook' },
  { key: 'dig', title: 'Digging' },
  { key: 'twist', title: 'The Turn' },
  { key: 'clash', title: 'The Reckoning' },
  { key: 'after', title: 'Aftermath' },
] as const;

export const APPROACHES: Record<Approach, { label: string; tests: string[]; lines: string[] }> = {
  talk: {
    label: 'Talk to people',
    tests: ['Charisma + Persuasion', 'Manipulation + Subterfuge', 'Composure + Insight', 'Charisma + Streetwise'],
    lines: [
      'You lean on {informant}, who knows more than they want to and less than they claim.',
      'A conversation over cold coffee goes sideways when {rival} walks in.',
      'You make promises you may not be able to keep. Someone writes them down.',
    ],
  },
  dig: {
    label: 'Dig for answers',
    tests: ['Intelligence + Investigation', 'Wits + Awareness', 'Resolve + Occult', 'Intelligence + Academics'],
    lines: [
      'Records, receipts and old photographs. One name keeps turning up: {culprit}.',
      'The details are wrong in a way that only makes sense if someone staged them.',
      'You find a pattern in the dates. It points to tonight.',
    ],
  },
  sneak: {
    label: 'Go in quietly',
    tests: ['Dexterity + Stealth', 'Wits + Larceny', 'Composure + Stealth', 'Dexterity + Athletics'],
    lines: [
      'You slip into {place} and see what you were not supposed to.',
      'A locked drawer, a hidden ledger and footsteps that stop right outside the door.',
      'You follow {culprit} three streets before realising someone is following you.',
    ],
  },
  force: {
    label: 'Kick the door in',
    tests: ['Strength + Brawl', 'Dexterity + Firearms', 'Strength + Intimidation', 'Stamina + Athletics'],
    lines: [
      'Subtlety is for people with time. You make {rival} answer questions the hard way.',
      'The door gives on the second try. Everything inside was moved an hour ago.',
      'You make enough noise that the whole district will remember tonight.',
    ],
  },
};

// What each approach leaves behind, carried into later acts.
export const CONSEQUENCES: Record<Approach, string[]> = {
  talk: ['{informant} now expects a favour in return.', 'Word gets around that you are asking questions.'],
  dig: ['You lose a night to it, and the trail is colder for it.', 'You learn something you cannot unlearn.'],
  sneak: ['Someone noticed a door left unlocked.', 'You leave with evidence, and a witness saw you.'],
  force: ['{rival} will not forget this.', 'The noise draws attention you did not want.'],
};

// Game-flavoured beats for the crossover. Mechanics are named, never quoted.
export const PRESSURE: Record<Game, string[]> = {
  vampire: [
    'Vampires in the scene feel the Hunger stir; a Rouse check is fair if anyone uses their blood.',
    'A Masquerade breach is one bad photo away. Who is filming?',
  ],
  werewolf: [
    'Werewolves feel Rage prickle at the wrongness here; anyone pushed too far may need a Rage check.',
    'The spirits nearby are watching to see what the pack will do.',
  ],
  hunter: [
    'Hunters see the shape of the threat at last. Desperation is earned the hard way: push for the Drive and risk it.',
    'Danger climbs: the quarry knows someone is coming.',
  ],
};

export const ENDINGS: string[] = [
  'The night ends with a debt owed, a door closed and one question nobody answered.',
  'It is over, for now. {patron} is grateful in the way that means they will call again.',
  'You walked away. Not everyone did. {district} will remember who stood up.',
  'Dawn comes grey and ordinary, and somewhere {culprit}’s people are already regrouping.',
];
