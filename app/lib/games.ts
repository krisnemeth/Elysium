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
    figure: { src: '/art/cover-ventrue.webp', width: 948, height: 1659, alt: 'A shaven-headed vampire in a black coat and corset.' },
    noun: { one: 'Kindred', many: 'Kindred', group: 'coterie', faction: 'Clan' },
    modes: { dark: 'Masquerade', light: 'Neon Nights' },
    greeting: 'Good evening.',
  },
  werewolf: {
    name: 'Werewolf',
    title: 'Werewolf: The Apocalypse',
    tagline: 'Rage, the Wyrm and the dying wild.',
    Logo: LogoWerewolf,
    figure: { src: '/art/vault/garou-brawler.webp', width: 791, height: 1400, alt: 'A muscular Garou in a vest, her fists wrapped for a fight.' },
    noun: { one: 'Garou', many: 'Garou', group: 'pack', faction: 'Tribe' },
    modes: { dark: 'Moonlit forest', light: 'The cave' },
    greeting: 'The moon is up.',
  },
  hunter: {
    name: 'Hunter',
    title: 'Hunter: The Reckoning',
    tagline: 'Ordinary people who know what hides in the dark.',
    Logo: LogoHunter,
    figure: { src: '/art/cover-hunter-2.webp', width: 1003, height: 1568, alt: 'A hunter in tactical gear and a dark scarf, arms crossed.' },
    noun: { one: 'Hunter', many: 'Hunters', group: 'cell', faction: 'Creed' },
    modes: { dark: 'The hideout', light: 'The city' },
    greeting: 'Case files are open.',
  },
};

export const gamePath = (game: Game, path = '') => `/vault/${game}${path}`;

// The game you were last in (RememberGame.tsx), for the pages that span all three; Vampire until you've been in one.
export const GAME_COOKIE = 'elysium-game';
export const DEFAULT_GAME: Game = 'vampire';
