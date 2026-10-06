import type { ComponentType, SVGProps } from 'react';
import type { Game } from './dice/rules';
import { LogoHunter, LogoVampire, LogoWerewolf } from '@/app/ui/svgs/official';

export type { Game };

export const GAMES_ORDER: Game[] = ['vampire', 'werewolf', 'hunter'];

export function isGame(value: string): value is Game {
  return (GAMES_ORDER as string[]).includes(value);
}

type GameInfo = {
  name: string;
  title: string;
  tagline: string;
  Logo: ComponentType<SVGProps<SVGSVGElement>>;
  figure: { src: string; width: number; height: number; alt: string };
  // What the game calls its characters, groups and factions.
  noun: { one: string; many: string; group: string; faction: string };
  // The two looks of each game's dashboard: [dark, light].
  modes: { dark: string; light: string };
  // Copy for the dashboard.
  greeting: string;
};

export const GAMES: Record<Game, GameInfo> = {
  vampire: {
    name: 'Vampire',
    title: 'Vampire: The Masquerade',
    tagline: 'Hunger, politics and the Masquerade.',
    Logo: LogoVampire,
    figure: { src: '/art/pale-vampire.webp', width: 1200, height: 1600, alt: 'A pale vampire with blood on her lips.' },
    noun: { one: 'Kindred', many: 'Kindred', group: 'coterie', faction: 'Clan' },
    modes: { dark: 'Masquerade', light: 'Neon Nights' },
    greeting: 'Good evening.',
  },
  werewolf: {
    name: 'Werewolf',
    title: 'Werewolf: The Apocalypse',
    tagline: 'Rage, the Wyrm and the dying wild.',
    Logo: LogoWerewolf,
    figure: { src: '/art/werewolf.webp', width: 1100, height: 1512, alt: 'A gaunt Garou in war form, bristling and snarling.' },
    noun: { one: 'Garou', many: 'Garou', group: 'pack', faction: 'Tribe' },
    modes: { dark: 'Moonlit forest', light: 'The cave' },
    greeting: 'The moon is up.',
  },
  hunter: {
    name: 'Hunter',
    title: 'Hunter: The Reckoning',
    tagline: 'Ordinary people who know what hides in the dark.',
    Logo: LogoHunter,
    figure: { src: '/art/hunter.webp', width: 900, height: 1886, alt: 'A hunter in a long dark coat, scarf over his face.' },
    noun: { one: 'Hunter', many: 'Hunters', group: 'cell', faction: 'Creed' },
    modes: { dark: 'The cabin', light: 'The inn' },
    greeting: 'Case files are open.',
  },
};

export const gamePath = (game: Game, path = '') => `/vault/${game}${path}`;
