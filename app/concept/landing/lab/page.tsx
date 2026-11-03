import Link from 'next/link';
import Navbar from '@/app/ui/navbar';

import CoverPicker from '../b/CoverPicker';
import GamesSection from '../b/GamesSection';
import Screens, { SECTIONS } from '../b/Screens';
import { COVERS, PEEK_STYLES, TAGLINE_PLACES, type PeekStyle, type TaglinePlace, coverIndex } from '../b/covers';

/*
  Picker lab for B: the logos are settled (at the foot, with arrows); this
  compares how strong the peek is and where the tagline lives. Swiping works
  on touch and on trackpads, and the sides of the stage turn the cover with
  a mouse. Review only.
*/

const PEEKS: Record<PeekStyle, { name: string; text: string }> = {
  strong: { name: 'Lean twice, light on the rail', text: 'The cover leans towards the next character twice, settling, while a light runs along the rail to the next tick and back.' },
  soft: { name: 'One lean', text: 'As before: one lean towards the next character and back.' },
};

const TAGLINES: Record<TaglinePlace, string> = {
  foot: 'Foot',
  top: 'Top',
  side: 'Side, large',
  none: 'None',
};

export default async function PickerLab({ searchParams }: PageProps<'/concept/landing/lab'>) {
  const { peek: p, tag: t, cover, replay: r } = await searchParams;
  const peek: PeekStyle = PEEK_STYLES.find((x) => x === p) ?? 'strong';
  const tagline: TaglinePlace = TAGLINE_PLACES.find((x) => x === t) ?? 'foot';
  const initial = coverIndex(typeof cover === 'string' ? cover : undefined);
  const replay = Number(r) || 0;
  const href = (next: { peek?: PeekStyle; tag?: TaglinePlace; replay?: number }) =>
    `/concept/landing/lab?peek=${next.peek ?? peek}&tag=${next.tag ?? tagline}${next.replay ? `&replay=${next.replay}` : ''}`;

  return (
    <>
      <Navbar sections={SECTIONS} />
      <main id='main'>
        <CoverPicker key={`${peek}-${tagline}-${replay}`} initial={initial} tagline={tagline} peekStyle={peek} />
        <GamesSection glow={COVERS[initial].glow} />
        <Screens initial={initial} />
      </main>

      <details open className='group fixed bottom-3 left-3 z-70 w-auto open:w-[min(21rem,calc(100vw-1.5rem))] rounded-2xl border border-bone/15 bg-[#0a0809]/85 p-2 text-sm backdrop-blur-md'>
        <summary className='lc-eyebrow cursor-pointer list-none px-2 py-1 group-open:pb-2'>Picker lab <span className='opacity-60 group-open:hidden'>(open)</span><span className='hidden opacity-60 group-open:inline'>(hide)</span></summary>
        <nav aria-label='Picker lab'>
          <p className='lc-eyebrow px-2 pb-2'>The peek</p>
        <ul className='flex flex-col gap-1'>
          {PEEK_STYLES.map((x) => (
            <li key={x}>
              <Link
                href={href({ peek: x })}
                aria-current={x === peek ? 'page' : undefined}
                className='block rounded-xl px-3 py-1.5 text-bone/70 transition-colors hover:bg-bone/5 aria-[current=page]:bg-bone aria-[current=page]:text-[#0a0809]'
              >
                <span className='font-semibold'>{PEEKS[x].name}</span>
                <span className='mt-0.5 block text-xs leading-snug opacity-80'>{PEEKS[x].text}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className='lc-eyebrow px-2 pt-3 pb-2'>The tagline</p>
        <ul className='flex gap-1'>
          {TAGLINE_PLACES.map((x) => (
            <li key={x} className='flex-1'>
              <Link
                href={href({ tag: x })}
                aria-current={x === tagline ? 'page' : undefined}
                className='block rounded-xl px-2 py-1.5 text-center text-xs text-bone/70 transition-colors hover:bg-bone/5 aria-[current=page]:bg-bone aria-[current=page]:text-[#0a0809]'
              >
                {TAGLINES[x]}
              </Link>
            </li>
          ))}
        </ul>
        <p className='flex items-center justify-between gap-3 px-2 pt-3 text-[0.7rem] leading-snug text-bone/50'>
          <span>The peek comes four seconds in, untouched. Swipe sideways on a trackpad or a touch screen, or click the sides.</span>
          <Link href={href({ replay: replay + 1 })} className='shrink-0 rounded-lg border border-bone/20 px-2.5 py-1 text-bone/80 hover:border-bone/50'>
            Replay peek
          </Link>
        </p>
        </nav>
      </details>
    </>
  );
}
