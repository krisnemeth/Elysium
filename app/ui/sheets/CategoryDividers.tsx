import { LogoAnkh } from '@/app/ui/svgs/official';
import Glyph from '@/app/ui/dice/Glyph';
import Explain from './Explain';

// The game's mark, chosen by the surrounding [data-game] (ankh by default).
function Mark({ flip }: { flip?: boolean }) {
  const rot = flip ? '-rotate-90' : 'rotate-90';
  return (
    <>
      <LogoAnkh aria-hidden className={`h-4 w-auto ${rot} text-accent in-data-[game=hunter]:hidden in-data-[game=werewolf]:hidden`} />
      <Glyph name='wta-claw.png' className={`hidden size-5 text-accent in-data-[game=werewolf]:inline-block ${flip ? '-scale-x-100' : ''}`} />
      <Glyph name='htr-flame.png' className='hidden size-5 text-accent in-data-[game=hunter]:inline-block' />
    </>
  );
}

// Section heading for character sheets.
export default function CategoryDividers({ title, id }: { title: string; id?: string }) {
  return (
    <div className='flex items-center gap-4'>
      <span className='h-px grow bg-linear-to-r from-transparent to-bone/20' />
      <Mark />
      <h2 id={id} className='text-center font-display text-3xl'>
        <Explain label={title} />
      </h2>
      <Mark flip />
      <span className='h-px grow bg-linear-to-l from-transparent to-bone/20' />
    </div>
  );
}
