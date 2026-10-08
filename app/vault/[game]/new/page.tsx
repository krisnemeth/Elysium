import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { GiCompass, GiQuillInk } from 'react-icons/gi';
import { createLoresheet } from '@/app/lib/actions/loresheets';
import { GAMES, gamePath, isGame } from '@/app/lib/games';
import { LORE_KINDS, type LoreKind } from '@/app/lib/loresheets';
import PageHeader from '@/app/ui/kit/PageHeader';
import { panel } from '@/app/ui/kit/styles';
import { ActionButton } from '@/app/ui/social/forms';
import { LORE_ICONS } from '@/app/ui/loresheets/icons';

export const metadata: Metadata = { title: 'New' };

const card = `group flex h-full w-full flex-col gap-3 p-6 text-left transition duration-300 hover:-translate-y-1 hover:border-bone/30 ${panel}`;

function Option({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return (
    <>
      <span className='text-accent [&>svg]:size-8'>{icon}</span>
      <span className='font-display text-2xl leading-tight'>{title}</span>
      <span className='text-sm leading-relaxed text-bone/60'>{body}</span>
    </>
  );
}

export default async function NewSheet({ params }: PageProps<'/vault/[game]/new'>) {
  const { game } = await params;
  if (!isGame(game)) notFound();
  const { noun } = GAMES[game];

  return (
    <div className='flex flex-col gap-10'>
      <PageHeader eyebrow={GAMES[game].name} title='What are you writing?' description='A character to play, or a loresheet about the world around them.' />

      <section aria-labelledby='character-title' className='flex flex-col gap-4'>
        <h2 id='character-title' className='font-display text-3xl'>A new {noun.one}</h2>
        <ul className='grid gap-4 md:grid-cols-2'>
          <li>
            <Link href={gamePath(game, '/new/guided')} className={card}>
              <Option icon={<GiCompass aria-hidden />} title='Guided' body='New to the game? Build your character step by step, with the rules explained along the way. You finish on the full sheet.' />
            </Link>
          </li>
          <li>
            <Link href={gamePath(game, '/new/classic')} className={card}>
              <Option icon={<GiQuillInk aria-hidden />} title='Classic sheet' body='The whole sheet at once, like filling in the printed one. For players who know what they want.' />
            </Link>
          </li>
        </ul>
      </section>

      <section aria-labelledby='lore-title' className='flex flex-col gap-4'>
        <h2 id='lore-title' className='font-display text-3xl'>A loresheet</h2>
        <ul className='grid gap-4 md:grid-cols-3'>
          {(Object.keys(LORE_KINDS) as LoreKind[]).map((k) => {
            const Icon = LORE_ICONS[k];
            return (
            <li key={k}>
              <ActionButton action={createLoresheet.bind(null, game, k)} className={card}>
                <Option icon={<Icon aria-hidden />} title={LORE_KINDS[k].label} body={LORE_KINDS[k].blurb} />
              </ActionButton>
            </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
