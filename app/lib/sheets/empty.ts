import { ATTRIBUTES, type Attribute, type GameKey, type Sheet } from './types';

// A blank sheet: every attribute at one dot, the game's starting tracks.
export function emptySheet(game: GameKey): Sheet {
  const attributes = Object.fromEntries(Object.values(ATTRIBUTES).flat().map((a) => [a, 1])) as Record<Attribute, number>;
  const base: Sheet = {
    profile: {},
    attributes,
    skills: {},
    trackers: { health: 4, willpower: 2 },
    advantages: [],
    convictions: [],
    biography: { appearance: '', history: '' },
  };
  if (game === 'vampire') return { ...base, trackers: { ...base.trackers, humanity: 7, hunger: 1 }, bloodPotency: 1, disciplines: [] };
  if (game === 'werewolf')
    return { ...base, trackers: { ...base.trackers, rage: 1, harano: 0, hauglosk: 0 }, renown: { glory: 0, honor: 0, wisdom: 0 }, gifts: [], rites: [] };
  return { ...base, trackers: { ...base.trackers, desperation: 0, danger: 0 }, edges: [] };
}
