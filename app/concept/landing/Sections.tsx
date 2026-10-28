import Image from 'next/image';
import Link from 'next/link';
import type { IconType } from 'react-icons';
import { GiBookmarklet, GiCrossedSwords, GiQuillInk, GiRoundTable, GiScrollUnfurled, GiSmartphone } from 'react-icons/gi';
import { MdArrowOutward } from 'react-icons/md';
import SectionBackdrop from '@/app/ui/home/SectionBackdrop';
import Stagger from '@/app/ui/kit/Stagger';
import { GAMES, GAMES_ORDER, gamePath } from '@/app/lib/games';
import { CHARACTERS } from '@/app/lib/sample-characters';
import forest from '@/public/art/ww-forest.webp';
import cave from '@/public/art/ww-cave.webp';
import hideout from '@/public/art/htr-den.webp';
import inn from '@/public/art/sheet-study.webp';
import vampireDark from '@/public/art/city-night.webp';
import vampireLight from '@/public/art/lore-dark.webp';

/*
  The sections both landing concepts share after their own first section:
  what's inside, the cross-game vault, the six themes, the dice and the final
  call. Content follows the live landing (app/page.tsx) so the concepts can be
  judged at full length; "Inside Elysium" adds the features the live landing
  doesn't mention yet (play mode, chronicles, loresheets).
*/

// The navbar's section dots, in page order.
export const SECTIONS = [
  { href: '#games', label: 'Games' },
  { href: '#inside', label: 'Inside' },
  { href: '#atmospheres', label: 'Themes' },
  { href: '#dice', label: 'Dice' },
];

const GLOW = { vampire: '#c8102e', werewolf: '#6f8f4e', hunter: '#f07a12' };

const FEATURES: { numeral: string; Icon: IconType; eyebrow: string; title: string; body: string }[] = [
  {
    numeral: 'I',
    Icon: GiQuillInk,
    eyebrow: 'Character creation',
    title: 'Guided, or straight onto the sheet',
    body: 'Walk through creation one choice at a time, with the rules checking your dots as you go, or open a blank sheet and fill it in your own order.',
  },
  {
    numeral: 'II',
    Icon: GiBookmarklet,
    eyebrow: 'Character sheets',
    title: 'The whole sheet, laid out like the book',
    body: 'Every game keeps its own sheet: Disciplines and Hunger, Gifts and Renown, Edges and Desperation. Nothing is simplified, and every change saves itself.',
  },
  {
    numeral: 'III',
    Icon: GiCrossedSwords,
    eyebrow: 'Play mode',
    title: 'Mark the damage, not the paper',
    body: 'At the table the sheet turns into tracks: Health and Willpower, Superficial and Aggravated damage, Stains, Rage and Despair, with experience logged as you spend it.',
  },
  {
    numeral: 'IV',
    Icon: GiRoundTable,
    eyebrow: 'Chronicles',
    title: 'Run a chronicle with friends',
    body: 'Invite your coterie, pack or cell. A Storyteller, or the Storyteller bot, runs the scene while everyone takes turns, rolls in the open and votes on what happens next.',
  },
  {
    numeral: 'V',
    Icon: GiScrollUnfurled,
    eyebrow: 'Loresheets',
    title: 'Write up the city as you find it',
    body: 'Keep your own notes on places, characters and the people who pull their strings, and share them with your chronicle.',
  },
  {
    numeral: 'VI',
    Icon: GiSmartphone,
    eyebrow: 'Anywhere',
    title: 'At the table, or on the night bus home',
    body: 'Elysium works on phones, tablets and laptops, and prints a clean sheet when you want paper in front of you.',
  },
];

const ATMOSPHERES = [
  { game: 'vampire', mode: 'Masquerade', frame: 'Gothic', image: vampireDark, loop: 'Crimson mist' },
  { game: 'vampire', mode: 'Neon Nights', frame: 'Neon', image: vampireLight, loop: 'Flickering neon' },
  { game: 'werewolf', mode: 'Moonlit forest', frame: 'Bark and ivy', image: forest, loop: 'Moon, clouds, fireflies' },
  { game: 'werewolf', mode: 'The cave', frame: 'Stone', image: cave, loop: 'Firelight, dripping water' },
  { game: 'hunter', mode: 'The hideout', frame: 'Steel pipe', image: hideout, loop: 'A lamp, cigarette smoke' },
  { game: 'hunter', mode: 'The inn', frame: 'Paper & tape', image: inn, loop: 'Dust in a sunbeam' },
] as const;

const DICE = [
  { game: 'vampire', dice: ['vampire-regular', 'vampire-hunger'], special: 'Hunger' },
  { game: 'werewolf', dice: ['werewolf-regular', 'werewolf-rage'], special: 'Rage' },
  { game: 'hunter', dice: ['hunter-regular', 'hunter-desperation'], special: 'Desperation' },
] as const;

export default function Sections() {
  const mixed = GAMES_ORDER.flatMap((g) => CHARACTERS.filter((c) => c.game === g).slice(0, 3));

  return (
    <div className='lc-sections relative z-3 bg-ink'>
      {/* Inside Elysium */}
      <section id='inside' aria-labelledby='lc-inside' className='scroll-mt-20 px-5 pt-12 pb-28 md:pt-16 md:pb-36'>
        <div className='mx-auto max-w-6xl'>
          <header className='lc-reveal max-w-2xl'>
            <p className='lc-eyebrow'>Inside Elysium</p>
            <h2 id='lc-inside' className='lc-display mt-5 text-5xl leading-[0.95] text-balance md:text-6xl'>
              Your character, kept safe from the sun.
            </h2>
          </header>
          <ol className='mt-16 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3'>
            {FEATURES.map(({ numeral, Icon, eyebrow, title, body }) => (
              <li key={numeral} className='lc-reveal border-t border-bone/15 pt-7'>
                <p className='flex items-center gap-4'>
                  <span className='lc-display text-4xl leading-none text-bone/45 italic'>{numeral}.</span>
                  <Icon aria-hidden className='size-6 text-bone/70' />
                  <span className='lc-eyebrow'>{eyebrow}</span>
                </p>
                <h3 className='lc-display mt-5 text-3xl leading-tight text-balance'>{title}</h3>
                <p className='mt-3 max-w-[44ch] leading-relaxed text-pretty text-bone/65'>{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Cross-game vault */}
      <section aria-labelledby='lc-cross' className='border-y border-bone/10 py-24'>
        <div className='mx-auto grid max-w-6xl gap-6 px-5 md:grid-cols-12'>
          <h2 id='lc-cross' className='lc-display lc-reveal text-4xl leading-tight text-balance md:col-span-5 md:text-5xl'>
            Any character. Even across games.
          </h2>
          <p className='lc-reveal max-w-[52ch] leading-relaxed text-bone/65 md:col-span-6 md:col-start-7'>
            Your Brujah, your Glass Walker and the priest who hunts them both live in the same vault. Crossover chronicles welcome.
          </p>
        </div>
        <ul className='mt-14 flex snap-x gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:thin] md:justify-center'>
          {mixed.map((c) => (
            <li key={c.slug} className='group w-40 shrink-0 snap-start'>
              <Link href={gamePath(c.game, '/characters')} className='block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone'>
                <span className='relative block overflow-hidden rounded-xl'>
                  <Image src={c.image.src} unoptimized={c.image.unoptimized} width={320} height={420} alt={`Portrait of ${c.name}.`} className='aspect-[3/4] w-full object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0' />
                  <span className='absolute top-2 left-2 rounded-full px-2 py-0.5 text-[0.6rem] tracking-[0.15em] text-white uppercase' style={{ background: GLOW[c.game] }}>
                    {GAMES[c.game].name}
                  </span>
                </span>
                <span className='lc-display mt-2 block truncate text-lg'>{c.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Six atmospheres */}
      <section id='atmospheres' aria-labelledby='lc-atmo' className='relative isolate scroll-mt-20 px-5 py-28 [text-shadow:0_0.15rem_1.25rem_rgb(0_0_0/0.85)] md:py-36'>
        <SectionBackdrop src='/locations/location-30.webp' />
        <div className='mx-auto max-w-6xl'>
          <h2 id='lc-atmo' className='lc-display lc-reveal max-w-3xl text-5xl leading-[0.95] text-balance md:text-6xl'>
            Every game has two rooms of its own.
          </h2>
          <p className='lc-reveal mt-5 max-w-[56ch] leading-relaxed text-bone/65'>
            Six themes, each with its own frame, light and a little something that never stops moving.
          </p>
          <Stagger className='mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {ATMOSPHERES.map((a) => (
              <figure key={a.mode} className='group relative aspect-[4/3] overflow-hidden rounded-2xl'>
                <Image src={a.image} alt='' placeholder='blur' sizes='(max-width: 640px) 100vw, 24rem' className='size-full object-cover transition duration-[1.4s] ease-(--ease-out-expo) group-hover:scale-110' />
                <div className='absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent' />
                <span aria-hidden className='absolute inset-3 rounded-xl border border-white/0 transition-colors duration-700 group-hover:border-white/30' />
                <figcaption className='absolute inset-x-5 bottom-4 text-[#ece8e1]'>
                  <span className='text-[0.65rem] tracking-[0.25em] uppercase' style={{ color: GLOW[a.game] }}>
                    {GAMES[a.game].name}
                  </span>
                  <span className='lc-display mt-1 block text-2xl'>{a.mode}</span>
                  <span className='mt-1 block text-xs text-[#ece8e1]/65'>
                    {a.frame} frame · {a.loop}
                  </span>
                </figcaption>
              </figure>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Dice */}
      <section id='dice' aria-labelledby='lc-dice' className='relative isolate scroll-mt-20 border-t border-bone/10 px-5 py-28 [text-shadow:0_0.15rem_1.25rem_rgb(0_0_0/0.85)]'>
        <SectionBackdrop src='/locations/location-53.webp' position='center 40%' />
        <div className='mx-auto max-w-6xl'>
          <h2 id='lc-dice' className='lc-display lc-reveal max-w-3xl text-5xl leading-[0.95] text-balance md:text-6xl'>
            The real dice, rolled in 3D.
          </h2>
          <p className='lc-reveal mt-5 max-w-[56ch] leading-relaxed text-bone/65'>
            Every game rolls its own d10s with its own rules: Hunger, Rage and Desperation, criticals, messy criticals, Brutal outcomes and Overreach.
          </p>
          <Stagger className='mt-14 grid gap-5 md:grid-cols-3'>
            {DICE.map((d) => (
              <Link key={d.game} href={gamePath(d.game, '/dice')} className='group flex flex-col items-center rounded-2xl border border-bone/10 p-8 transition duration-700 hover:-translate-y-1 hover:border-bone/25 focus-visible:outline-2 focus-visible:outline-bone'>
                <span className='flex gap-4'>
                  {d.dice.map((name, i) => (
                    <Image
                      key={name}
                      src={`/dice/official/${name}.webp`}
                      width={309}
                      height={339}
                      alt=''
                      className={`w-20 transition duration-700 ease-(--ease-spring) group-hover:-translate-y-2 ${i ? 'group-hover:rotate-12' : 'group-hover:-rotate-12'}`}
                    />
                  ))}
                </span>
                <span className='lc-display mt-6 text-2xl'>{GAMES[d.game].name}</span>
                <span className='text-xs tracking-[0.2em] text-bone/50 uppercase'>{d.special} dice</span>
              </Link>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Final call */}
      <section className='px-5 pt-8 pb-32'>
        <div className='lc-reveal mx-auto flex max-w-4xl flex-col items-center text-center'>
          <h2 className='lc-display text-5xl leading-tight text-balance md:text-7xl'>Who are you bringing into the night?</h2>
          <Link href='/vault/new' className='lc-btn lc-btn-solid mt-10'>
            Create a character
            <MdArrowOutward aria-hidden />
          </Link>
        </div>
      </section>
    </div>
  );
}
