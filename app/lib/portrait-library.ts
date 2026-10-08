import type { Game } from './games';

// Portraits hosted with the site that players can pick (and then crop),
// grouped by game. Add more here as the library grows (see the roadmap).
export type LibraryPortrait = { src: string; label: string };

export const PORTRAIT_LIBRARY: Record<Game, LibraryPortrait[]> = {
  vampire: [
    { src: '/Female1.jpg', label: 'Punk with crosses' },
    { src: '/Female2.jpg', label: 'Woman in shadow' },
    { src: '/Female3.jpg', label: 'Woman in red' },
    { src: '/Female4.jpeg', label: 'Woman, full figure' },
    { src: '/Male1.jpg', label: 'Man in a suit' },
    { src: '/Male2.jpg', label: 'Man in a coat' },
    { src: '/Brujah.jpg', label: 'Street fighter' },
    { src: '/Gangrel.jpg', label: 'Wild one' },
    { src: '/Malkavian.jpg', label: 'Seer' },
    { src: '/Nosferatu.jpeg', label: 'Scarred face' },
    { src: '/Tremere.jpg', label: 'Scholar' },
    { src: '/Ventrue.jpg', label: 'Aristocrat' },
    { src: '/art/pale-vampire.webp', label: 'Pale vampire' },
  ],
  werewolf: [
    { src: '/portraits/garou-crinos.webp', label: 'War form' },
    { src: '/portraits/garou-punk.webp', label: 'Punk' },
    { src: '/portraits/garou-drifter.webp', label: 'Drifter' },
    { src: '/art/werewolf.webp', label: 'Werewolf' },
  ],
  hunter: [
    { src: '/portraits/hunter-flannel.webp', label: 'Flannel' },
    { src: '/portraits/hunter-priest.webp', label: 'Priest' },
    { src: '/portraits/hunter-tech.webp', label: 'Tech' },
    { src: '/portraits/hunter-trench.webp', label: 'Trench coat' },
    { src: '/portraits/hunter-vesna.webp', label: 'Vesna' },
    { src: '/art/hunter.webp', label: 'Hunter' },
  ],
};
