import { GAMES, type Game } from '@/app/lib/games';
import { panel } from '@/app/ui/kit/styles';
import Paper from '@/app/ui/game/Paper';
import CategoryDividers from './CategoryDividers';
import SheetSections from './SheetNav';
import { GAME_SHEETS } from './game-sheets';

// The full character sheet for a game, section by section (inside an editor). On phones, one section at a time.
export default function SheetForm({ game }: { game: Game }) {
  const { Logo, title } = GAMES[game];
  const sections = GAME_SHEETS[game];
  return (
    <>
      {/* Not a <form>: it autosaves, and Enter must not submit or reload. */}
      <div className='flex justify-center py-4 max-md:hidden'>
        <Logo aria-label={title} role='img' className='h-auto w-64 text-bone/80 md:w-80' />
      </div>
      <SheetSections sections={sections.map(({ id, label }) => ({ id, label }))}>
        <div className='flex flex-col gap-6'>
          {sections.map(({ id, label, body }, i) => (
            <div key={id} data-section={id}>
              <Paper index={i}>
                {(torn) => (
                  <section id={id} aria-labelledby={`${id}-title`} className={`reveal scroll-mt-48 p-5 md:scroll-mt-24 md:p-8 ${torn} ${panel}`}>
                    <CategoryDividers id={`${id}-title`} title={label} />
                    <div className='mt-6 md:mt-8'>{body}</div>
                  </section>
                )}
              </Paper>
            </div>
          ))}
        </div>
      </SheetSections>
    </>
  );
}
