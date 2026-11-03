import Link from 'next/link';
import Navbar from '@/app/ui/navbar';
import Footer from '../Footer';
import Sections, { SECTIONS } from '../Sections';
import CoverPicker from '../b/CoverPicker';
import GamesSection from '../b/GamesSection';
import { COVERS, HANDOVERS, type Handover, coverIndex } from '../b/covers';

/*
  Hand-over lab for B: the whole page, with three ways the next section can
  take over from the cover as you scroll (landing.css). Pick one in the panel
  and scroll; pick a character first to see it with each game's colours.
  Review only.
*/

const ABOUT: Record<Handover, { name: string; text: string }> = {
  moonrise: {
    name: 'Moonrise',
    text: 'A dome rises from below and flattens as it reaches the top, lit along its rim. The character sinks back into the dark, the mark floats up slower than the dome.',
  },
  iris: {
    name: 'Iris',
    text: 'The portfolio’s oval reveal at full size: a flat ellipse opens from the foot of the screen behind an accent ring. The character pushes towards you and burns down, the mark turns.',
  },
  slash: {
    name: 'Slash',
    text: 'A steep blade cuts up from the bottom right with an accent edge, like the portfolio’s wipe bar. The character is pushed left and blurs out, the mark slides the other way.',
  },
};

export default async function HandoverLab({ searchParams }: PageProps<'/concept/landing/lab'>) {
  const { handover: wanted, cover } = await searchParams;
  const handover: Handover = HANDOVERS.find((h) => h === wanted) ?? 'moonrise';
  const initial = coverIndex(typeof cover === 'string' ? cover : undefined);

  return (
    <>
      <Navbar sections={SECTIONS} />
      <main id='main'>
        <CoverPicker key={handover} initial={initial} handover={handover} />
        <GamesSection glow={COVERS[initial].glow} handover={handover} />
        <Sections />
      </main>
      <Footer />

      <nav aria-label='Hand-over' className='fixed bottom-3 left-3 z-70 w-[min(22rem,calc(100vw-1.5rem))] rounded-2xl border border-bone/15 bg-[#0a0809]/85 p-2 text-sm backdrop-blur-md'>
        <p className='lc-eyebrow px-2 pt-1 pb-2'>Hand-over lab · scroll to play</p>
        <ul className='flex flex-col gap-1'>
          {HANDOVERS.map((h, i) => (
            <li key={h}>
              <Link
                href={`/concept/landing/lab?handover=${h}`}
                aria-current={h === handover ? 'page' : undefined}
                className='block rounded-xl px-3 py-2 text-bone/70 transition-colors hover:bg-bone/5 aria-[current=page]:bg-bone aria-[current=page]:text-[#0a0809]'
              >
                <span className='font-semibold'>
                  {i + 1}. {ABOUT[h].name}
                </span>
                <span className='mt-0.5 block text-xs leading-snug opacity-80'>{ABOUT[h].text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
