// Storyteller bot personas: a voice, a pace and a temper for the bot.
//
// DARK PACK RULE: every line below is original writing for Elysium, and none
// of the personas is modelled on a named character from any World of Darkness
// product. They are archetypes of telling (the archivist, the night watch...),
// not people. See plans/dark-pack-compliance.md before adding anything here.
//
// A persona does not change the story's facts (threat, NPCs, acts); it changes
// how the bot tells it and how hard it pushes:
// - pacing: how many searches fit in one act (a brisk bot gives fewer);
// - density: how much it describes (spare cuts the scenery, rich adds asides);
// - pressure: a bias on the suggested difficulty and how many extra pressure
//   lines it adds to each scene;
// - voice: openers, choice labels, asides, pressure lines, endings and senses.
// Everything is picked with a seeded generator (generate.ts), so the same
// seed and persona always give the same story.

import type { Approach, Tone } from './content';

export type PersonaId = 'archivist' | 'nightwatch' | 'wire' | 'hearthkeeper' | 'breaker';
export type Pacing = 'unhurried' | 'steady' | 'brisk';
export type Density = 'spare' | 'balanced' | 'rich';

export type Persona = {
  id: PersonaId;
  name: string;
  // One line on the card, then a longer description for choosing.
  tagline: string;
  characterisation: string;
  // The tone the persona grew out of (the old tone picker), kept so chronicles
  // made before personas existed map to the nearest one.
  tone: Tone;
  pacing: Pacing;
  density: Density;
  // Added to every suggested difficulty (clamped to 2..5).
  difficulty: -1 | 0 | 1;
  // Extra pressure lines per scene, on top of the game's own (0 to 2).
  push: 0 | 1 | 2;
  // Short tags shown on the card.
  traits: string[];
  voice: {
    openers: string[];
    // How the options are worded for this persona.
    search: string;
    labels: Record<Approach, string>;
    // Extra scenery, used by rich personas after the main narration.
    asides: string[];
    // Extra pressure, used in proportion to `push`.
    pressure: string[];
    // Extra lines of atmosphere for a scene's location.
    senses: string[];
    endings: string[];
  };
};

export const PERSONAS: Record<PersonaId, Persona> = {
  archivist: {
    id: 'archivist',
    name: 'The Archivist',
    tagline: 'Dry, courtly and always three moves ahead.',
    characterisation:
      'Tells the story as a ledger of favours: who owes whom, who said what and to whom. Describes at length, lets conversations breathe and rarely raises its voice. Best for groups who like scheming, bargains and reading between the lines.',
    tone: 'intrigue',
    pacing: 'unhurried',
    density: 'rich',
    difficulty: 0,
    push: 1,
    traits: ['Intrigue', 'Unhurried', 'Rich detail', 'Gentle pressure'],
    voice: {
      openers: [
        'Everyone you meet tonight wants something from you.',
        'The invitation came on good paper, unsigned.',
        'There is a ledger somewhere with your name in it, and tonight someone intends to read from it.',
        'Politeness is the sharpest thing in the room, and it is being used well.',
      ],
      search: 'Quietly ask around',
      labels: {
        talk: 'Call in a favour',
        dig: 'Go through the records',
        sneak: 'Slip in unannounced',
        force: 'Drop the manners',
      },
      asides: [
        'Nobody here says what they mean; they say what costs them least. Listen for the gaps.',
        'Small courtesies change hands like currency, and every one of them is entered somewhere.',
        'A pen is set down a little too carefully. In rooms like this, that is a statement.',
      ],
      pressure: [
        'Every favour spent tonight is one you will not have tomorrow.',
        'Someone is keeping a tally of what the group has promised.',
      ],
      senses: [
        'Old paper, polish and the faint warmth of a room that has hosted many quiet deals.',
        'A clock ticks somewhere, and nobody has wound it in living memory.',
        'The silence has been arranged, like the chairs.',
      ],
      endings: [
        'The books are closed for the night. Whatever is owed will be collected, politely, later.',
        'Everyone is gracious in the morning. That is how you know how much was decided.',
        'You hold three promises and one secret, and only one of them is yours.',
      ],
    },
  },

  nightwatch: {
    id: 'nightwatch',
    name: 'The Night Watch',
    tagline: 'Slow dread and details that are slightly wrong.',
    characterisation:
      'Takes its time and lets the quiet do the work. Describes what is almost normal, then one thing that is not, and never explains it. Asks you to open doors it would rather you left shut. Best for groups who want atmosphere and unease over fights.',
    tone: 'horror',
    pacing: 'unhurried',
    density: 'rich',
    difficulty: 0,
    push: 1,
    traits: ['Horror', 'Unhurried', 'Rich detail', 'Rising dread'],
    voice: {
      openers: [
        'Something about the quiet tonight feels arranged.',
        'The streetlights flicker in a rhythm, like breathing.',
        'It is the hour when even the people who know better stop checking behind them.',
        'Every window you pass shows a room slightly emptier than it should be.',
      ],
      search: 'Look closer, if you dare',
      labels: {
        talk: 'Ask, and listen to the pauses',
        dig: 'Open what was left closed',
        sneak: 'Move without being seen',
        force: 'Break the silence',
      },
      asides: [
        'Nothing moves. That is the trouble: nothing moves, and yet the room is not the way you left it.',
        'You count the exits twice, and the second count is different.',
        'A sound repeats exactly, like a recording of itself, and each time it is a little closer.',
      ],
      pressure: [
        'The dark here is patient. It is waiting to see who goes first.',
        'Someone in the group is certain they are being watched, and they are right.',
      ],
      senses: [
        'The cold does not come from any direction. It is simply there, like a held breath.',
        'Your own footsteps sound borrowed.',
        'The shadows lie the wrong way for the light.',
      ],
      endings: [
        'It ends, but the feeling does not. You will keep glancing behind you for a long while.',
        'Dawn arrives and the street looks innocent. That is almost the worst of it.',
        'Something let you leave. You do not yet know what it asked for in return.',
      ],
    },
  },

  wire: {
    id: 'wire',
    name: 'The Wire',
    tagline: 'Fast, blunt and already moving.',
    characterisation:
      'Short sentences, no scenery, and a clock that is always running. Gives you the facts and the next decision, then pushes hard when you hesitate. Best for groups who want momentum, chases and fights, and who are happy to be rushed.',
    tone: 'action',
    pacing: 'brisk',
    density: 'spare',
    difficulty: 0,
    push: 2,
    traits: ['Action', 'Brisk', 'Spare detail', 'Heavy pressure'],
    voice: {
      openers: [
        'Sirens somewhere close. Not for you, yet.',
        'You have maybe an hour before this gets loud.',
        'No time for introductions. The first problem is already walking toward you.',
        'Engines idle in the street below. Somebody wants to leave fast, and somebody wants to stop them.',
      ],
      search: 'Grab a lead, fast',
      labels: {
        talk: 'Lean on someone',
        dig: 'Find the answer now',
        sneak: 'Get in and out',
        force: 'Go through them',
      },
      asides: [
        'Move.',
        'Clock is running.',
        'No second chances on this one.',
      ],
      pressure: [
        'The window is closing. Anything you do not do now, someone else will do first.',
        'Another team is on the same trail, and they are not asking permission.',
        'Whatever you choose, the next scene starts hot.',
      ],
      senses: [
        'Hot metal, spilled petrol and the echo of someone leaving in a hurry.',
        'The floor is scuffed in a hurry. Someone was dragged, or ran.',
        'A door swings on its hinge, still moving.',
      ],
      endings: [
        'Done. Breathe. The next call is already ringing.',
        'You are out. Count who walked with you, and who did not.',
        'It was loud and it was quick, and the dust is only now beginning to settle.',
      ],
    },
  },

  hearthkeeper: {
    id: 'hearthkeeper',
    name: 'The Hearthkeeper',
    tagline: 'Warm, patient and on your side.',
    characterisation:
      'Tells the story like a host at a fire: clear, kind and never in a hurry. Keeps the stakes real but the tests forgiving, and nudges the group toward a good idea when it is stuck. Best for new groups, new Storytellers and cosy evenings.',
    tone: 'intrigue',
    pacing: 'steady',
    density: 'balanced',
    difficulty: -1,
    push: 1,
    traits: ['Welcoming', 'Steady', 'Balanced detail', 'Forgiving'],
    voice: {
      openers: [
        'Settle in. Tonight there is a puzzle, and you are exactly the people to take it on.',
        'Somebody has put the kettle on and somebody else has a problem. Both are about to become your business.',
        'It starts small, the way the best trouble does, with a favour asked by someone who cannot quite say why.',
        'The night is calm for now, and you have just enough time to look at what is in front of you.',
      ],
      search: 'Take a careful look around',
      labels: {
        talk: 'Have a word with someone',
        dig: 'Think it through and check the facts',
        sneak: 'Tread softly',
        force: 'Take a firm stand',
      },
      asides: [
        'If you are unsure where to start, start with the person who looks the most worried.',
        'There is a thread here, and you only need to pull gently.',
        'You are not alone in this. Someone in this district wants you to win.',
      ],
      pressure: [
        'It is worth a moment to agree who covers what before anyone commits.',
      ],
      senses: [
        'It is the kind of place that has seen worse and is still standing.',
        'There is a lamp on somewhere, and it is nearly enough.',
        'Something is cooking nearby, which is somehow reassuring.',
      ],
      endings: [
        'It is over, and you did well. There will be more to tell by the next time you meet.',
        'The street is quiet again, and you have earned the walk home.',
        'Not everything is solved, but the worst is behind you, and you have friends who know it.',
      ],
    },
  },

  breaker: {
    id: 'breaker',
    name: 'The Breaker',
    tagline: 'Hard, fair and never lets you off lightly.',
    characterisation:
      'Plays the world as it would be if nobody was protecting you. Sets steeper tests, remembers every shortcut and leaves a cost behind every choice. Not cruel, but not generous either. Best for experienced groups who want real risk and stakes.',
    tone: 'horror',
    pacing: 'steady',
    density: 'balanced',
    difficulty: 1,
    push: 2,
    traits: ['Grim', 'Steady', 'Balanced detail', 'Hard tests'],
    voice: {
      openers: [
        'Nobody is coming to help. That is the first thing to understand.',
        'The problem is older than you, and meaner. It has been winning for a long time.',
        'Whatever you decide tonight, someone pays for it. Choose who.',
        'The rules of the district are simple: anyone who looks weak is used.',
      ],
      search: 'Dig, and pay for what you find',
      labels: {
        talk: 'Make a deal, and live with it',
        dig: 'Take the hard road to the truth',
        sneak: 'Risk being caught',
        force: 'Put someone through the wall',
      },
      asides: [
        'There is no clean option here. Pick the one you can live with.',
        'Whatever you leave undone will be waiting when you come back.',
        'Mercy is possible. It will cost you something you wanted.',
      ],
      pressure: [
        'Every mistake tonight is permanent. Expect the world to remember.',
        'The opposition is better prepared than you, and it shows.',
        'Someone close to this is going to be hurt whichever way you move.',
      ],
      senses: [
        'The air has the weight of a place where people have lost more than they won.',
        'Scorch marks, a broken lock, a stain no one has scrubbed.',
        'Nothing here is for you. You are borrowing the room and the room knows it.',
      ],
      endings: [
        'You survived. Add up what it cost before you call that a win.',
        'The debt is settled, and a new one is already written.',
        'The district keeps its secrets, and a few of yours as well.',
      ],
    },
  },
};

export const PERSONA_ORDER: PersonaId[] = ['archivist', 'nightwatch', 'wire', 'hearthkeeper', 'breaker'];

export function isPersonaId(value: unknown): value is PersonaId {
  return typeof value === 'string' && Object.hasOwn(PERSONAS, value);
}

// Chronicles made before personas stored only a tone; map it to the nearest one.
const TONE_DEFAULT: Record<Tone, PersonaId> = { intrigue: 'archivist', horror: 'nightwatch', action: 'wire' };

export function personaFor(state: { persona?: string; tone?: Tone }): Persona {
  if (isPersonaId(state.persona)) return PERSONAS[state.persona];
  return PERSONAS[TONE_DEFAULT[state.tone ?? 'intrigue'] ?? 'archivist'];
}
