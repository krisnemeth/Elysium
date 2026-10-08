'use client';

import dynamic from 'next/dynamic';
import type { Game } from '@/app/lib/games';

// The draft lives in sessionStorage, so the builder only renders in the browser.
const GuidedCreation = dynamic(() => import('./GuidedCreation'), {
  ssr: false,
  loading: () => <div className='grid h-64 place-items-center text-sm text-bone/40'>Opening the guide…</div>,
});

export default function GuidedLoader({ game }: { game: Game }) {
  return <GuidedCreation game={game} />;
}
