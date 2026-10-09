import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { MdArrowOutward } from 'react-icons/md';
import Navbar from '@/app/ui/navbar';
import SectionBackdrop from '@/app/ui/home/SectionBackdrop';
import Stagger from '@/app/ui/kit/Stagger';
import { LogoWod } from '@/app/ui/svgs/official';
import { Elysium1 } from '@/app/ui/svgs';
import { GAMES, GAMES_ORDER, gamePath } from '@/app/lib/games';
import { CHARACTERS } from '@/app/lib/sample-characters';
import { DARK_PACK_LOGO, DARK_PACK_NOTICE, NOT_OFFICIAL_NOTICE, WORLD_OF_DARKNESS_URL } from '@/app/lib/dark-pack';
import forest from '@/public/art/ww-forest.webp';
import cave from '@/public/art/ww-cave.webp';
import cabin from '@/public/art/htr-cabin.webp';
import inn from '@/public/art/sheet-study.webp';
import vampireDark from '@/public/art/city-night.webp';
import vampireLight from '@/public/art/lore-dark.webp';

export const metadata: Metadata = {
  title: { absolute: 'Elysium — a character vault for the World of Darkness' },
  description:
    'Build and keep characters for Vampire: The Masquerade, Werewolf: The Apocalypse and Hunter: The Reckoning, each with its own sheet, dice and atmosphere.',
};

// Each game's colour for the hero triptych and the "doors".
const GLOW = { vampire: '#c8102e', werewolf: '#6f8f4e', hunter: '#f07a12' };

const ATMOSPHERES = [
  { game: 'vampire', mode: 'Masquerade', frame: 'Gothic', image: vampireDark, loop: 'Crimson mist' },
  { game: 'vampire', mode: 'Neon Nights', frame: 'Neon', image: vampireLight, loop: 'Flickering neon' },
  { game: 'werewolf', mode: 'Moonlit forest', frame: 'Leaves', image: forest, loop: 'Moon, clouds, fireflies' },
  { game: 'werewolf', mode: 'The cave', frame: 'Stone', image: cave, loop: 'Firelight, dripping water' },
  { game: 'hunter', mode: 'The cabin', frame: 'Timber', image: cabin, loop: 'A swinging bulb' },
  { game: 'hunter', mode: 'The inn', frame: 'Paper & tape', image: inn, loop: 'Dust in a sunbeam' },
] as const;

const DICE = [
  { game: 'vampire', dice: ['vampire-regular', 'vampire-hunger'], special: 'Hunger' },
  { game: 'werewolf', dice: ['werewolf-regular', 'werewolf-rage'], special: 'Rage' },
  { game: 'hunter', dice: ['hunter-regular', 'hunter-desperation'], special: 'Desperation' },
] as const;

const cta =
  'group inline-flex items-center gap-2 rounded-full bg-bone px-7 py-3.5 text-sm font-semibold text-ink transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_2.5rem_-0.5rem_var(--accent)] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone';
const ghost =
  'inline-flex items-center gap-2 rounded-full border border-bone/30 px-6 py-3.5 text-sm text-bone transition duration-300 hover:border-bone/70 hover:bg-bone/5 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone';

export default function Home() {
  const mixed = GAMES_ORDER.flatMap((g) => CHARACTERS.filter((c) => c.game === g).slice(0, 3));

  return (
    <div data-game='wod' className='min-h-svh bg-ink text-bone transition-colors duration-500'>
      <a href='#main' className='sr-only z-[60] rounded-md bg-bone px-4 py-2 text-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3'>
        Skip to content
      </a>
      <Navbar
        sections={[
          { href: '#worlds', label: 'Games' },
          { href: '#atmospheres', label: 'Themes' },
          { href: '#dice', label: 'Dice' },
        ]}
      />

      <main id='main'>
        {/* Hero: three worlds side by side */}
        <section aria-labelledby='hero-title' className='relative isolate flex min-h-svh flex-col overflow-hidden bg-[#0c0c0d]'>
          <div className='absolute inset-0 -z-10 flex flex-col md:flex-row'>
            {GAMES_ORDER.map((g) => {
              const { figure } = GAMES[g];
              return (
                <Link
                  key={g}
                  href={gamePath(g)}
                  aria-label={`Open the ${GAMES[g].title} dashboard`}
                  className='group relative flex-1 overflow-hidden transition-[flex-grow] duration-1000 ease-(--ease-out-expo) hover:flex-[1.6]'
                >
                  <Image
                    src={figure.src}
                    alt=''
                    fill
                    preload
                    sizes='(max-width: 768px) 100vw, 40vw'
                    className='object-cover object-top opacity-60 grayscale transition duration-1000 ease-(--ease-out-expo) group-hover:scale-105 group-hover:opacity-90 group-hover:grayscale-0'
                  />
                  <div
                    className='absolute inset-0 opacity-0 mix-blend-color transition-opacity duration-1000 group-hover:opacity-40'
                    style={{ background: GLOW[g] }}
                  />
                  <span className='absolute inset-x-0 bottom-28 text-center text-xs tracking-[0.4em] text-[#ece8e1]/0 uppercase transition-colors duration-700 group-hover:text-[#ece8e1]/90 md:bottom-10'>
                    {GAMES[g].name}
                  </span>
                </Link>
              );
            })}
          </div>
          {/* Fog drifting across the triptych */}
          <div aria-hidden className='pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_30%,#0c0c0d_85%)]' />
          <div
            aria-hidden
            className='pointer-events-none absolute -bottom-1/4 -left-1/4 -z-10 h-1/2 w-[150%] rounded-[50%] bg-[#ece8e1]/10 blur-3xl'
            style={{ animation: 'drift-x 26s ease-in-out infinite alternate' }}
          />

          <div className='pointer-events-none mt-auto mb-auto flex flex-col items-center px-6 pt-24 text-center'>
            <LogoWod
              aria-label='World of Darkness'
              role='img'
              className='glow-pulse h-auto w-48 text-[#ece8e1] drop-shadow-[0_0_1.5rem_rgb(0_0_0/0.9)] md:w-60'
            />
            <h1 id='hero-title' className='mt-8 max-w-4xl font-display text-6xl leading-[0.92] font-medium tracking-tight text-balance text-[#ece8e1] drop-shadow-[0_0.25rem_1.5rem_rgb(0_0_0/0.9)] md:text-8xl'>
              A vault for the creatures of the dark.
            </h1>
            <p className='mt-6 max-w-xl text-lg leading-relaxed text-pretty text-[#ece8e1]/80 drop-shadow-[0_0.25rem_1rem_rgb(0_0_0/0.9)]'>
              Vampires, werewolves and the hunters who stalk them. Build every character, from any game, in one place.
            </p>
            <div className='pointer-events-auto mt-10 flex flex-wrap justify-center gap-3'>
              <Link href='/vault/new' className={`${cta} bg-[#ece8e1] text-[#0c0c0d]`}>
                Create a character
                <MdArrowOutward aria-hidden className='transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
              </Link>
              <Link href='/vault' className={`${ghost} border-[#ece8e1]/30 bg-[#0c0c0d]/40 text-[#ece8e1] backdrop-blur-md`}>
                Open your vault
              </Link>
            </div>
          </div>
        </section>

        {/* The three games */}
        <section id='worlds' aria-labelledby='worlds-title' className='relative isolate scroll-mt-20 px-6 py-28 [text-shadow:0_0.15rem_1.25rem_rgb(0_0_0/0.85)] md:py-36'>
          <SectionBackdrop src='/locations/location-3.webp' position='center 60%' />
          <div className='mx-auto max-w-6xl'>
            <header className='reveal max-w-2xl'>
              <LogoWod aria-label='World of Darkness' role='img' className='h-auto w-40 text-bone/70' />
              <h2 id='worlds-title' className='mt-8 font-display text-5xl leading-[0.95] tracking-tight text-balance md:text-6xl'>
                Three games. One night.
              </h2>
              <p className='mt-5 max-w-[56ch] leading-relaxed text-bone/65'>
                Each game gets its own dashboard, sheet and dice, with an atmosphere to match. Step inside one and the whole vault changes around you.
              </p>
            </header>
            <Stagger className='mt-16 grid gap-5 md:grid-cols-3'>
              {GAMES_ORDER.map((g) => {
                const { Logo, title, tagline, modes } = GAMES[g];
                return (
                  <Link
                    key={g}
                    href={gamePath(g)}
                    className='group relative flex flex-col overflow-hidden rounded-2xl border border-bone/10 bg-bone/[0.03] p-7 transition duration-700 ease-(--ease-out-expo) hover:-translate-y-1.5 hover:border-transparent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone'
                  >
                    <span
                      aria-hidden
                      className='absolute inset-0 -z-10 opacity-0 transition-opacity duration-700 group-hover:opacity-100'
                      style={{ background: `radial-gradient(ellipse at 50% 120%, ${GLOW[g]}55, transparent 70%)` }}
                    />
                    <Logo aria-label={title} role='img' className='h-16 w-auto self-start text-bone' />
                    <p className='mt-8 leading-relaxed text-bone/70'>{tagline}</p>
                    <p className='mt-6 text-xs tracking-[0.2em] text-bone/45 uppercase'>
                      {modes.dark} · {modes.light}
                    </p>
                    <span className='mt-8 inline-flex items-center gap-1.5 text-sm text-bone transition-colors group-hover:text-accent'>
                      Enter <MdArrowOutward aria-hidden className='transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
                    </span>
                  </Link>
                );
              })}
            </Stagger>
          </div>
        </section>

        {/* Cross-game vault */}
        <section aria-labelledby='cross-title' className='border-y border-bone/10 py-24'>
          <div className='mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-12'>
            <h2 id='cross-title' className='reveal font-display text-4xl leading-tight text-balance md:col-span-5 md:text-5xl'>
              Any character. Even across games.
            </h2>
            <p className='reveal max-w-[52ch] leading-relaxed text-bone/65 md:col-span-6 md:col-start-7'>
              Your Brujah, your Glass Walker and the priest who hunts them both live in the same vault. Crossover chronicles welcome.
            </p>
          </div>
          <ul className='mt-14 flex snap-x gap-4 overflow-x-auto px-6 pb-4 [scrollbar-width:thin] md:justify-center'>
            {mixed.map((c) => (
              <li key={c.slug} className='group w-40 shrink-0 snap-start'>
                <Link href={gamePath(c.game, '/characters')} className='block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone'>
                  <span className='relative block overflow-hidden rounded-xl'>
                    <Image src={c.image.src} unoptimized={c.image.unoptimized} width={320} height={420} alt={`Portrait of ${c.name}.`} className='aspect-[3/4] w-full object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0' />
                    <span className='absolute top-2 left-2 rounded-full px-2 py-0.5 text-[0.6rem] tracking-[0.15em] text-white uppercase' style={{ background: GLOW[c.game] }}>
                      {GAMES[c.game].name}
                    </span>
                  </span>
                  <span className='mt-2 block truncate font-display text-lg'>{c.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Six atmospheres */}
        <section id='atmospheres' aria-labelledby='atmo-title' className='relative isolate scroll-mt-20 px-6 py-28 [text-shadow:0_0.15rem_1.25rem_rgb(0_0_0/0.85)] md:py-36'>
          <SectionBackdrop src='/locations/location-30.webp' />
          <div className='mx-auto max-w-6xl'>
            <h2 id='atmo-title' className='reveal max-w-3xl font-display text-5xl leading-[0.95] tracking-tight text-balance md:text-6xl'>
              Every game has two rooms of its own.
            </h2>
            <p className='reveal mt-5 max-w-[56ch] leading-relaxed text-bone/65'>
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
                    <span className='mt-1 block font-display text-2xl'>{a.mode}</span>
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
        <section id='dice' aria-labelledby='dice-title' className='relative isolate scroll-mt-20 border-t border-bone/10 px-6 py-28 [text-shadow:0_0.15rem_1.25rem_rgb(0_0_0/0.85)]'>
          <SectionBackdrop src='/locations/location-53.webp' position='center 40%' />
          <div className='mx-auto max-w-6xl'>
            <h2 id='dice-title' className='reveal max-w-3xl font-display text-5xl leading-[0.95] tracking-tight text-balance md:text-6xl'>
              The real dice, rolled in 3D.
            </h2>
            <p className='reveal mt-5 max-w-[56ch] leading-relaxed text-bone/65'>
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
                  <span className='mt-6 font-display text-2xl'>{GAMES[d.game].name}</span>
                  <span className='text-xs tracking-[0.2em] text-bone/50 uppercase'>{d.special} dice</span>
                </Link>
              ))}
            </Stagger>
          </div>
        </section>

        {/* Final call */}
        <section className='px-6 pb-32'>
          <div className='reveal mx-auto flex max-w-4xl flex-col items-center text-center'>
            <h2 className='font-display text-5xl leading-tight text-balance md:text-7xl'>Who are you bringing into the night?</h2>
            <Link href='/vault/new' className={`${cta} mt-10`}>
              Create a character
              <MdArrowOutward aria-hidden className='transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
            </Link>
          </div>
        </section>
      </main>

      <footer className='border-t border-bone/10 px-6 py-14 text-sm text-bone/55'>
        <div className='mx-auto grid max-w-6xl gap-10 md:grid-cols-12'>
          <div className='md:col-span-4'>
            <Elysium1 aria-hidden className='h-auto w-28 text-bone/80' />
            <p className='mt-4 max-w-[30ch]'>A character vault for the World of Darkness.</p>
          </div>
          <nav aria-label='Games' className='flex flex-col gap-2 md:col-span-3'>
            {GAMES_ORDER.map((g) => (
              <Link key={g} href={g === 'vampire' ? '/vampire' : gamePath(g)} className='transition-colors hover:text-bone'>
                {GAMES[g].title}
              </Link>
            ))}
          </nav>
          <div className='flex gap-4 text-xs leading-relaxed text-bone/45 md:col-span-5'>
            <Image src={DARK_PACK_LOGO.src} width={DARK_PACK_LOGO.width} height={DARK_PACK_LOGO.height} alt={DARK_PACK_LOGO.alt} className='size-14 shrink-0' />
            <div className='flex flex-col gap-2'>
              <p>
                {DARK_PACK_NOTICE.replace('worldofdarkness.com.', '')}
                <a href={WORLD_OF_DARKNESS_URL} className='underline underline-offset-2 hover:text-bone'>
                  worldofdarkness.com
                </a>
                .
              </p>
              <p>{NOT_OFFICIAL_NOTICE}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
