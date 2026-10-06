import type { Metadata } from 'next';
import PageHeader from '@/app/ui/kit/PageHeader';
import DiceRoller from '@/app/ui/dice/DiceRoller';
import { GAMES, isGame } from '@/app/lib/games';
import { SPECIAL_DIE_NAME } from '@/app/lib/dice/rules';
import { notFound } from 'next/navigation';

export const metadata: Metadata = { title: 'Dice' };

const COPY = {
  vampire: { title: 'Roll with your Hunger.', body: 'Criticals, messy criticals, bestial failures, rouse checks and Willpower rerolls.' },
  werewolf: { title: 'Let the Rage in.', body: 'Rage dice, Brutal outcomes, Rage checks and Willpower rerolls (Brutal results stay put).' },
  hunter: { title: 'Roll for the cell.', body: 'Desperation dice, Overreach or Despair, Danger, and Willpower rerolls.' },
};

export default async function DicePage({ params }: PageProps<'/vault/[game]/dice'>) {
  const { game } = await params;
  if (!isGame(game)) notFound();
  return (
    <div className='flex flex-col gap-10'>
      <PageHeader eyebrow={`${GAMES[game].name} · ${SPECIAL_DIE_NAME[game]} dice`} title={COPY[game].title} description={COPY[game].body} />
      <DiceRoller key={game} game={game} />
    </div>
  );
}
