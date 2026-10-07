import { GAMES, type Game } from '@/app/lib/games';
import { panel } from '@/app/ui/kit/styles';
import Paper from '@/app/ui/game/Paper';
import CategoryDividers from './CategoryDividers';
import SheetNav from './SheetNav';
import { GAME_SHEETS } from './game-sheets';

// The full character sheet for a game, section by section (inside an editor).
export default function SheetForm({ game }: { game: Game }) {
  const { Logo, title } = GAMES[game];
  const sections = GAME_SHEETS[game];
  return (
    <>
      <SheetNav sections={sections.map(({ id, label }) => ({ id, label }))} />
      {/* Not a <form>: it autosaves, and Enter must not submit or reload. */}
      <div className='flex flex-col gap-6'>
        <div className='flex justify-center py-4'>
          <Logo aria-label={title} role='img' className='h-auto w-64 text-bone/80 md:w-80' />
        </div>
        {sections.map(({ id, label, body }, i) => (
          <Paper key={id} index={i}>
            {(torn) => (
              <section id={id} aria-labelledby={`${id}-title`} className={`reveal scroll-mt-48 p-5 md:scroll-mt-24 md:p-8 ${torn} ${panel}`}>
                <CategoryDividers id={`${id}-title`} title={label} />
                <div className='mt-8'>{body}</div>
              </section>
            )}
          </Paper>
        ))}
      </div>
    </>
  );
}
