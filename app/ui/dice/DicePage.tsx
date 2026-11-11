import PageHeader from '@/app/ui/kit/PageHeader';
import DiceRoller from '@/app/ui/dice/DiceRoller';
import { GAMES, type Game } from '@/app/lib/games';
import { SPECIAL_DIE_NAME } from '@/app/lib/dice/rules';

const COPY = {
  vampire: { title: 'Roll with your Hunger.', body: 'Criticals, messy criticals, bestial failures, rouse checks and Willpower rerolls.' },
  werewolf: { title: 'Let the Rage in.', body: 'Rage dice, Brutal outcomes, Rage checks and Willpower rerolls (Brutal results stay put).' },
  hunter: { title: 'Roll for the cell.', body: 'Desperation dice, Overreach or Despair, Danger, and Willpower rerolls.' },
};

// The dice page (also shown by the dev-only capture route). Sized to the window on desktops, so the tray and its history fit one screen.
export default function DicePage({ game }: { game: Game }) {
  return (
    <div className='flex flex-col gap-4 md:gap-8 desk:h-[calc(100svh-6.5rem)] desk:min-h-[34rem] short:gap-5'>
      <PageHeader compact eyebrow={`${GAMES[game].name} · ${SPECIAL_DIE_NAME[game]} dice`} title={COPY[game].title} description={COPY[game].body} />
      <DiceRoller key={game} game={game} fill />
    </div>
  );
}
