import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GiScrollUnfurled } from 'react-icons/gi';
import { createLoresheet } from '@/app/lib/actions/loresheets';
import { getLoresheets } from '@/app/lib/data/loresheets';
import { GAMES, isGame } from '@/app/lib/games';
import { LORE_KINDS, type LoreKind } from '@/app/lib/loresheets';
import EmptyState from '@/app/ui/kit/EmptyState';
import PageHeader from '@/app/ui/kit/PageHeader';
import { panel } from '@/app/ui/kit/styles';
import { ActionButton } from '@/app/ui/social/forms';
import { LORE_ICONS } from '@/app/ui/loresheets/icons';

export const metadata: Metadata = { title: 'Loresheets' };

const btn = 'rounded-full border border-bone/20 px-4 py-2 text-sm text-bone/85 transition hover:border-bone/50 hover:text-bone';

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
        actions={kinds.map((k) => {
          const Icon = LORE_ICONS[k];
          return (
            <ActionButton key={k} action={createLoresheet.bind(null, game, k)} className={`${btn} inline-flex items-center gap-2`}>
              <Icon aria-hidden className='size-4 text-accent' /> New {LORE_KINDS[k].noun}
            </ActionButton>
          );
        })}
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
                      <Link href={`/vault/${game}/loresheets/${l.id}`} className={`flex h-full flex-col gap-2 p-5 transition hover:-translate-y-1 ${panel}`}>
                        <span className='font-display text-2xl leading-tight'>{l.title || `Untitled ${LORE_KINDS[k].noun}`}</span>
                        <span className='line-clamp-3 text-sm text-bone/60'>
                          {Object.values(l.content).find((v) => v?.trim()) || 'Nothing written yet.'}
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
