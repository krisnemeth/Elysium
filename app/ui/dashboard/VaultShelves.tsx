import Link from 'next/link';
import { GiScrollUnfurled } from 'react-icons/gi';
import CharacterRow from '@/app/ui/dashboard/CharacterRow';
import { buttonGhost, panel } from '@/app/ui/kit/styles';
import Stagger from '@/app/ui/kit/Stagger';
import { LORE_ICONS } from '@/app/ui/loresheets/icons';
import { gamePath, type Game } from '@/app/lib/games';
import { LORE_KINDS, type LoreKind } from '@/app/lib/loresheets';
import type { Character } from '@/app/lib/sample-characters';

export type LoresheetLink = { id: string; title: string; kind: LoreKind };

// What every game's vault shares: the drafts to pick up and the loresheets.
export default function VaultShelves({ game, drafts, loresheets }: { game: Game; drafts: Character[]; loresheets: LoresheetLink[] }) {
  return (
    <div className='grid gap-4 lg:grid-cols-2'>
      <section aria-labelledby='drafts-title' className={`p-5 ${panel}`}>
        <h2 id='drafts-title' className='px-2 font-display text-2xl'>Drafts</h2>
        {drafts.length > 0 ? (
          <Stagger as='ul' className='mt-3 flex flex-col'>
            {drafts.map((c) => (
              <CharacterRow key={c.slug} character={c} />
            ))}
          </Stagger>
        ) : (
          <p className='px-2 py-6 text-sm text-bone/50'>No drafts in progress. New characters start here.</p>
        )}
      </section>

      <section aria-labelledby='lore-title' className={`flex flex-col p-5 ${panel}`}>
        <div className='flex items-baseline justify-between px-2'>
          <h2 id='lore-title' className='font-display text-2xl'>Loresheets</h2>
          <Link href={gamePath(game, '/loresheets')} className='text-xs tracking-[0.2em] text-bone/50 uppercase transition-colors hover:text-bone'>
            All
          </Link>
        </div>
        {loresheets.length ? (
          <ul className='mt-3 flex flex-col'>
            {loresheets.slice(0, 4).map((l) => {
              const Icon = LORE_ICONS[l.kind];
              return (
                <li key={l.id}>
                  <Link href={gamePath(game, `/loresheets/${l.id}`)} className='flex items-center justify-between gap-3 rounded-xl px-2 py-2.5 transition hover:bg-bone/[0.05]'>
                    <Icon aria-hidden className='size-5 shrink-0 text-accent/80' />
                    <span className='grow truncate'>{l.title || `Untitled ${LORE_KINDS[l.kind].noun}`}</span>
                    <span className='shrink-0 text-[0.65rem] tracking-[0.15em] text-bone/45 uppercase'>{LORE_KINDS[l.kind].label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className='flex grow flex-col items-center justify-center gap-3 px-4 py-8 text-center'>
            <GiScrollUnfurled aria-hidden className='size-10 text-accent/70' />
            <p className='max-w-[32ch] text-sm leading-relaxed text-bone/55'>Loresheets hold the histories, places and grudges your sheets have no room for.</p>
            <Link href={gamePath(game, '/loresheets')} className={buttonGhost}>Write one</Link>
          </div>
        )}
      </section>
    </div>
  );
}
