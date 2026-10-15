import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GiScrollUnfurled } from 'react-icons/gi';
import { getLoresheets } from '@/app/lib/data/loresheets';
import { GAMES, isGame } from '@/app/lib/games';
import { LORE_KINDS, type LoreKind } from '@/app/lib/loresheets';
import EmptyState from '@/app/ui/kit/EmptyState';
import PageHeader from '@/app/ui/kit/PageHeader';
import { panel } from '@/app/ui/kit/styles';
import { LORE_ICONS } from '@/app/ui/loresheets/icons';
import { LoreImage } from '@/app/ui/loresheets/LoreImagePicker';
import NewLoresheet from '@/app/ui/loresheets/NewLoresheet';

export const metadata: Metadata = { title: 'Loresheets' };

export default async function Loresheets({ params }: PageProps<'/vault/[game]/loresheets'>) {
  const { game } = await params;
  if (!isGame(game)) notFound();
  const list = await getLoresheets(game);
  const kinds = Object.keys(LORE_KINDS) as LoreKind[];

  return (
    <div className='flex flex-col gap-10'>
      <PageHeader
        eyebrow={`${GAMES[game].name} · Loresheets`}
        title='The lore.'
        description='Places, histories and faces that don’t fit on a character sheet.'
        actions={<NewLoresheet game={game} />}
      />
      {list.length === 0 ? (
        <EmptyState icon={<GiScrollUnfurled aria-hidden />} title='No loresheets yet'>
          Start one for a place the story keeps returning to, a character’s history, or an NPC worth remembering.
        </EmptyState>
      ) : (
        kinds
          .filter((k) => list.some((l) => l.kind === k))
          .map((k) => (
            <section key={k} aria-label={LORE_KINDS[k].label}>
              <h2 className='flex items-center gap-3 font-display text-3xl'>
                {(() => {
                  const Icon = LORE_ICONS[k];
                  return <Icon aria-hidden className='size-7 text-accent' />;
                })()}
                {LORE_KINDS[k].label}s
              </h2>
              <ul className='mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                {list
                  .filter((l) => l.kind === k)
                  .map((l) => (
                    <li key={l.id}>
                      <Link
                        href={`/vault/${game}/loresheets/${l.id}`}
                        className={`flex h-full overflow-hidden transition hover:-translate-y-1 ${k === 'location' ? 'flex-col' : 'flex-row'} ${panel}`}
                      >
                        {/* Places show their picture wide on top; people show it tall beside the text. */}
                        {(l.image || k === 'location') && (
                          <LoreImage
                            src={l.image}
                            kind={k}
                            alt=''
                            sizes={k === 'location' ? '(max-width: 640px) 100vw, 24rem' : '6rem'}
                            className={k === 'location' ? 'w-full' : 'w-24 shrink-0'}
                          />
                        )}
                        <span className='flex min-w-0 flex-col gap-2 p-5'>
                          <span className='font-display text-2xl leading-tight'>{l.title || `Untitled ${LORE_KINDS[k].noun}`}</span>
                          <span className='line-clamp-3 text-sm text-bone/60'>
                            {Object.values(l.content).find((v) => v?.trim()) || 'Nothing written yet.'}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </section>
          ))
      )}
    </div>
  );
}
