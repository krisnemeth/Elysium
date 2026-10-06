import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageHeader from '@/app/ui/kit/PageHeader';
import { panel } from '@/app/ui/kit/styles';
import CategoryDividers from '@/app/ui/sheets/CategoryDividers';
import SheetNav from '@/app/ui/sheets/SheetNav';
import { GAME_SHEETS } from '@/app/ui/sheets/game-sheets';
import { GAMES, isGame } from '@/app/lib/games';

export const metadata: Metadata = { title: 'New character sheet' };

export default async function NewSheet({ params }: PageProps<'/vault/[game]/new'>) {
  const { game } = await params;
  if (!isGame(game)) notFound();
  const { Logo, title, noun } = GAMES[game];
  const sections = GAME_SHEETS[game];
  return (
    <div className='flex flex-col gap-8'>
      <PageHeader
        eyebrow={`New ${noun.one}`}
        title='Character sheet'
        description='Fill it in as you would the printed sheet. Click a dot to set a rating; use the arrow keys on a focused rating.'
      />
      <SheetNav sections={sections.map(({ id, label }) => ({ id, label }))} />
      <form className='flex flex-col gap-6'>
        <div className='flex justify-center py-4'>
          <Logo aria-label={title} role='img' className='h-auto w-64 text-bone/80 md:w-80' />
        </div>
        {sections.map(({ id, label, body }) => (
          <section key={id} id={id} aria-labelledby={`${id}-title`} className={`reveal scroll-mt-48 p-5 md:scroll-mt-24 md:p-8 ${panel}`}>
            <CategoryDividers id={`${id}-title`} title={label} />
            <div className='mt-8'>{body}</div>
          </section>
        ))}
      </form>
    </div>
  );
}
