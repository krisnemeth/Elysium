import Image from 'next/image';
import Link from 'next/link';
import { MdAdd } from 'react-icons/md';
import { GiD10 } from 'react-icons/gi';
import PageHeader from '@/app/ui/kit/PageHeader';
import { buttonPrimary, buttonGhost, panel } from '@/app/ui/kit/styles';
import type { Character } from '@/app/lib/sample-characters';

// Pin positions on the board (percent) and tilt, for up to six photos.
const PINS = [
  { x: 8, y: 10, r: -6 },
  { x: 38, y: 4, r: 4 },
  { x: 68, y: 12, r: -3 },
  { x: 22, y: 52, r: 5 },
  { x: 56, y: 50, r: -5 },
  { x: 80, y: 56, r: 3 },
];

export default function HunterOverview({ characters: cell }: { characters: Character[] }) {
  const open = cell.filter((c) => c.status === 'draft').length;

  return (
    <div className='flex flex-col gap-10'>
      <PageHeader
        eyebrow='Hunter · The cell'
        title='Case files are open.'
        description='Everyone in the cell, everything you know about the quarry. Pin it up, roll for it, and watch the Danger.'
        actions={
          <>
            <Link href='/vault/hunter/new' className={buttonPrimary}>
              <MdAdd aria-hidden className='size-4 transition-transform duration-300 group-hover:rotate-90' />
              Open a new file
            </Link>
            <Link href='/vault/hunter/dice' className={buttonGhost}>
              <GiD10 aria-hidden className='size-4 transition-transform duration-500 ease-(--ease-spring) group-hover:rotate-180' />
              Roll for the cell
            </Link>
          </>
        }
      />

      <section aria-labelledby='board-title' className={`relative overflow-hidden p-4 md:p-6 ${panel}`}>
        <h2 id='board-title' className='sr-only'>Case board</h2>
        {/* Corkboard rim with a map pinned across it: woodland by the cabin, the city at the inn. */}
        <div className='rounded-lg bg-[#8a6038] p-3 shadow-[inset_0_0_2rem_rgb(0_0_0/0.5)] [background-image:radial-gradient(rgb(0_0_0/0.2)_1px,transparent_1.5px),radial-gradient(rgb(255_255_255/0.1)_1px,transparent_1.5px)] [background-position:0_0,3px_4px] [background-size:7px_7px,9px_8px] md:p-4'>
        <div className='relative aspect-[4/5] overflow-hidden rounded-sm shadow-[0_0.5rem_1.5rem_-0.5rem_rgb(0_0_0/0.6)] sm:aspect-[16/9]'>
          <Image src='/maps/woodland.svg' alt='' fill unoptimized className='hidden object-cover dark:block' />
          <Image src='/maps/city.svg' alt='' fill unoptimized className='object-cover dark:hidden' />
          <div aria-hidden className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgb(60_40_20/0.35))]' />
          {/* Red string between the photos */}
          <svg aria-hidden className='absolute inset-0 size-full' viewBox='0 0 100 100' preserveAspectRatio='none'>
            <polyline
              points={PINS.slice(0, cell.length).map((p) => `${p.x + 8},${p.y + 4}`).join(' ')}
              fill='none'
              stroke='#b3151b'
              strokeWidth='0.35'
              vectorEffect='non-scaling-stroke'
              style={{ strokeWidth: 2 }}
            />
          </svg>

          {cell.map((c, i) => {
            const p = PINS[i % PINS.length];
            return (
              <Link
                key={c.slug}
                href={`/vault/hunter/characters/${c.slug}`}
                className='group absolute w-[30%] max-w-44 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:w-[18%]'
                style={{ left: `${p.x}%`, top: `${p.y}%`, rotate: `${p.r}deg` }}
              >
                <span className='block bg-[#f7f2e6] p-2 pb-7 shadow-[0_0.75rem_1.25rem_-0.5rem_rgb(0_0_0/0.7)] transition duration-500 ease-(--ease-spring) group-hover:-translate-y-2 group-hover:scale-105 group-hover:rotate-0'>
                  <Image src={c.image.src} width={240} height={320} alt={`Photo of ${c.name}.`} className='aspect-square w-full object-cover sepia-[0.35]' />
                  <span className='mt-1 block truncate text-center font-display text-xs text-[#2b2119] md:text-sm'>{c.name}</span>
                </span>
                {/* Pushpin */}
                <span className='absolute -top-1.5 left-1/2 size-3.5 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_35%_35%,#ff6b5e,#a3100f)] shadow-[0_2px_3px_rgb(0_0_0/0.5)]' />
              </Link>
            );
          })}

          {cell.length === 0 && (
            <div className='absolute top-1/2 left-1/2 w-[70%] max-w-xs -translate-x-1/2 -translate-y-1/2 -rotate-2 bg-[#fdf6e3] px-5 pt-6 pb-5 text-center text-[#2b2119] shadow-[0_0.75rem_1.5rem_-0.5rem_rgb(0_0_0/0.7)]'>
              <span aria-hidden className='absolute -top-1.5 left-1/2 size-3.5 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_35%_35%,#ff6b5e,#a3100f)] shadow-[0_2px_3px_rgb(0_0_0/0.5)]' />
              <p className='font-display text-lg'>No files on the board.</p>
              <p className='mt-1 text-xs leading-relaxed opacity-75'>Open a file on your first hunter and pin them up here.</p>
              <Link href='/vault/hunter/new' className='mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#a3100f] underline underline-offset-4 hover:no-underline'>
                <MdAdd aria-hidden /> Open the first file
              </Link>
            </div>
          )}

          {/* Sticky notes */}
          <div className='absolute right-[4%] bottom-[5%] w-[34%] max-w-40 rotate-[4deg] bg-[#f3d36b] p-3 font-display text-xs text-[#3a2a10] shadow-[0_0.5rem_1rem_-0.5rem_rgb(0_0_0/0.6)] sm:w-[16%]'>
            Desperation: 1<br />
            Danger: 2<br />
            <span className='opacity-70'>Don&apos;t go back to the bell tower.</span>
          </div>
          <div className='absolute bottom-[8%] left-[4%] w-[30%] max-w-36 -rotate-[5deg] bg-[#fdf6e3] p-3 font-display text-xs text-[#3a2a10] shadow-[0_0.5rem_1rem_-0.5rem_rgb(0_0_0/0.6)] sm:w-[14%]'>
            {cell.length} hunter{cell.length === 1 ? '' : 's'}
            <br />
            {open} open file{open === 1 ? '' : 's'}
          </div>
        </div>
        </div>
      </section>
    </div>
  );
}
