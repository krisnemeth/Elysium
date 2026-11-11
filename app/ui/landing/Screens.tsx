import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import type React from 'react';
import type { IconType } from 'react-icons';
import { GiBookmarklet, GiCrossedSwords, GiQuillInk, GiRoundTable, GiScrollUnfurled, GiSmartphone } from 'react-icons/gi';
import { MdArrowOutward } from 'react-icons/md';
import { GAMES, GAMES_ORDER, gamePath, type Game } from '@/app/lib/games';
import Footer from './Footer';
import { COVERS } from './covers';
import Clip from './Clip';
import Strip from './Strip';
import { at, BODY } from './kit';
import SceneWeather from './SceneWeather';
import ScreenWatch from './ScreenWatch';

/*
  The sections after "Three games. One night.", each one screen tall
  (.lc-screen, landing.css), its content starting 16px under the navbar.
  They carry the chosen cover down the page: its colours (--lc-scene-glow and
  --lc-scene-tint on <html>), its game's type for the headings
  (.lc-scene-type), its weather behind the text (SceneWeather), and its own
  room, game and character marked where they come up again
  (data-scene / data-game, matched against <html data-lc-scene / data-lc-game>).
  Each screen plays its entrance once when it comes into view (ScreenWatch;
  .lc-in and its variants), and the backdrops drift with the scroll.
*/

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
    eyebrow: 'Chronicles · coming soon',
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

// Each cover's room as the app has it: its frame and the thing that keeps moving.
const ROOMS: Record<string, { frame: string; loop: string }> = {
  masquerade: { frame: 'Gothic frame', loop: 'Crimson mist' },
  neon: { frame: 'Neon frame', loop: 'Flickering neon' },
  forest: { frame: 'Bark and ivy', loop: 'Moon, clouds, fireflies' },
  cave: { frame: 'Stone frame', loop: 'Firelight, dripping water' },
  hideout: { frame: 'Steel pipe', loop: 'A lamp, cigarette smoke' },
  'hunter-2': { frame: 'Flyers and tape', loop: 'Rain, fog, streetlamps' },
};

const DICE = [
  { game: 'vampire', dice: ['vampire-regular', 'vampire-hunger'], special: 'Hunger', line: 'Rouse the blood and watch the Hunger dice for a messy critical or a bestial failure.' },
  { game: 'werewolf', dice: ['werewolf-regular', 'werewolf-rage'], special: 'Rage', line: 'Rage dice in the pool, Rage checks for Gifts and shifting, and Brutal outcomes when the wolf takes over.' },
  { game: 'hunter', dice: ['hunter-regular', 'hunter-desperation'], special: 'Desperation', line: 'Add Desperation when it all goes wrong, and choose: Overreach, or sink into Despair.' },
] as const;

const TONE = { vampire: 'lc-glow-v', werewolf: 'lc-glow-w', hunter: 'lc-glow-h' } as const;

// The vault's procession: the cover characters and six more, cut-outs on
// their game's scene, game by game in turn, the Storyteller bringing up the rear.
type Person = { key: string; src: string; width: number; height: number; who: string; game: Game | null; alt: string };
const MORE: Person[] = [
  { key: 'toreador', src: '/art/vault/toreador.webp', width: 800, height: 1400, who: 'The Toreador', game: 'vampire', alt: 'A red-haired vampire in a black and crimson gown, a clutch in one hand.' },
  { key: 'punk', src: '/art/vault/punk-vampire.webp', width: 933, height: 1400, who: 'The anarch', game: 'vampire', alt: 'A punk vampire with black and red hair, a studded leather jacket and torn jeans.' },
  { key: 'biker', src: '/art/vault/garou-biker.webp', width: 788, height: 1400, who: 'The grinning one', game: 'werewolf', alt: 'A grinning Garou in a battered leather jacket, beckoning with one finger.' },
  { key: 'brawler', src: '/art/vault/garou-brawler.webp', width: 791, height: 1400, who: 'The brawler', game: 'werewolf', alt: 'A scarred Garou with braided blonde hair and taped fists.' },
  { key: 'researcher', src: '/art/vault/hunter-tablet.webp', width: 791, height: 1400, who: 'The researcher', game: 'hunter', alt: 'A scarred hunter lit by the tablet in his hand.' },
];
const STORYTELLER: Person = { key: 'storyteller', src: '/art/vault/storyteller.webp', width: 896, height: 1400, who: 'The Storyteller', game: null, alt: 'A bearded man in round sunglasses and a tweed waistcoat, a cigarette in his hand.' };
const COVER_WHO: Record<string, string> = { masquerade: 'The Ventrue', neon: 'The Malkavian', forest: 'The Glass Walker', cave: 'The old wolf', hideout: 'The firestarter', 'hunter-2': 'The veteran' };
const SCENE_OF: Record<Game, string> = { vampire: '/art/city-night.webp', werewolf: '/art/ww-forest.webp', hunter: '/art/htr-den.webp' };

function procession(): Person[] {
  const all: Person[] = [...COVERS.map((c) => ({ key: c.id, src: c.src, width: c.width, height: c.height, who: COVER_WHO[c.id], game: c.game, alt: c.alt })), ...MORE];
  const byGame = GAMES_ORDER.map((g) => all.filter((p) => p.game === g));
  const out: Person[] = [];
  for (let i = 0; i < Math.max(...byGame.map((l) => l.length)); i++) for (const list of byGame) if (list[i]) out.push(list[i]);
  return [...out, STORYTELLER];
}

// The clips, recorded from inside the app (public/landing/).
const clip = (name: string) => ({ src: `/landing/${name}.mp4`, poster: `/landing/${name}.webp` });
// The six scenes alone, as the app draws them behind everything (/capture/<game>/scene).
const SCENE_CLIPS: Record<string, string> = { masquerade: 'scene-masquerade', neon: 'scene-neon', forest: 'scene-forest', cave: 'scene-cave', hideout: 'scene-hideout', 'hunter-2': 'scene-city' };

// The chronicle table (a still from the app; until one is in place, the
// table's own act art stands in).
const CHRONICLE_SHOT = { src: '/acts/hook.webp', alt: 'The chronicle table in Elysium.' };

// The navbar's section links.



function Heading({ id, eyebrow, children, className }: { id: string; eyebrow: string; children: React.ReactNode; className?: string }) {
  return (
    <header className={clsx('max-w-3xl', className)}>
      <p className='lc-eyebrow text-(--lc-glow-text) lc-in' style={at(0)}>
        {eyebrow}
      </p>
      <h2 id={id} className='lc-display lc-scene-type lc-in lc-in-curtain mt-[clamp(0.75rem,2svh,1.25rem)] text-[clamp(2.4rem,6.4svh,4rem)] leading-[0.98] text-balance' style={at(1)}>
        {children}
      </h2>
    </header>
  );
}

export default function Screens({ initial }: { initial: number }) {
  const rooms = GAMES_ORDER.flatMap((g) => COVERS.filter((c) => c.game === g));
  const people = procession();

  return (
    <div className='lc-bx'>
      <SceneWeather initial={initial} />
      <ScreenWatch />

      {/* Inside Elysium */}
      <section id='inside' aria-labelledby='lc-inside' className='lc-screen [--wash-at:15%_0%]'>
        <div className={BODY}>
          <div className='grid gap-x-12 gap-y-4 lg:grid-cols-12 lg:items-end'>
            <Heading id='lc-inside' eyebrow='Inside Elysium' className='lg:col-span-7'>
              Your character, kept safe from the sun.
            </Heading>
            <p className='lc-in max-w-[46ch] leading-relaxed text-pretty text-bone/65 lg:col-span-5 lg:pb-2' style={at(2)}>
              Everything a player carries between sessions, in one place that remembers the rules for you.
            </p>
          </div>
          <ol className='mt-[clamp(1.5rem,5svh,3.5rem)] grid flex-1 content-start gap-x-10 gap-y-[clamp(1.25rem,4svh,2.75rem)] sm:grid-cols-2 lg:grid-cols-3'>
            {FEATURES.map(({ numeral, Icon, eyebrow, title, body }, i) => (
              <li key={numeral} className='lc-in lc-in-rule relative pt-[clamp(0.9rem,2.4svh,1.5rem)]' style={at(i + 3)}>
                <p className='flex items-center gap-4'>
                  <span className='lc-display text-(--lc-glow-text) [text-shadow:0_0_1.5rem_color-mix(in_oklab,var(--lc-glow)_55%,transparent)] text-[clamp(1.9rem,4.4svh,2.4rem)] leading-none italic'>{numeral}.</span>
                  <Icon aria-hidden className='size-6 text-bone/70' />
                  <span className='lc-eyebrow'>{eyebrow}</span>
                </p>
                <h3 className='lc-display lc-scene-type mt-[clamp(0.6rem,1.8svh,1.1rem)] text-[clamp(1.4rem,3.3svh,1.9rem)] leading-tight text-balance'>{title}</h3>
                <p className='mt-2 max-w-[44ch] text-[clamp(0.85rem,1.8svh,1rem)] leading-relaxed text-pretty text-bone/65'>{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Two ways to make a character: the guided steps and the classic sheet, recorded in the app */}
      <section id='create' aria-labelledby='lc-create' className='lc-screen [--wash-at:20%_100%]'>
        <div className={BODY}>
          <div className='grid gap-x-12 gap-y-4 lg:grid-cols-12 lg:items-end'>
            <Heading id='lc-create' eyebrow='Character creation' className='lg:col-span-7'>
              Two ways into the night.
            </Heading>
            <p className='lc-in max-w-[46ch] leading-relaxed text-pretty text-bone/65 lg:col-span-5 lg:pb-2' style={at(2)}>
              Let the guide walk you through it, a choice at a time with the rules kept for you, or take the blank sheet and fill it in your own order.
            </p>
          </div>
          <div className='mt-[clamp(1.25rem,4svh,3rem)] grid min-h-0 flex-1 gap-4 md:grid-cols-2'>
            {[
              {
                name: 'guided-vampire',
                title: 'Guided',
                line: 'Eleven short steps, from a name to a finished sheet.',
                points: ['One choice at a time, each one explained', 'Points and dots counted for you', 'Ends on the full sheet, ready to play'],
              },
              {
                name: 'classic-vampire',
                title: 'Classic',
                line: 'The whole sheet at once, laid out like the book.',
                points: ['Every field of the printed sheet, in any order', 'Click a dot to rate, or use the arrow keys', 'Saved as you go'],
              },
            ].map((c, i) => (
              <figure key={c.name} data-clip-host className='lc-in lc-in-wipe flex min-h-0 flex-col overflow-hidden rounded-xl border border-bone/15 bg-[#0a0809]/60 shadow-[0_2rem_4rem_-2rem_rgb(0_0_0/0.8)] backdrop-blur-[3px]' style={at(i + 3)}>
                {/* The clip, a still until hovered, on the top half */}
                <div className='relative min-h-36 basis-1/2 overflow-hidden border-b border-bone/10 bg-[#050405]'>
                  <Clip {...clip(c.name)} label={`${c.title} character creation in Elysium.`} className='absolute inset-0 size-full object-cover object-top' />
                </div>
                <figcaption className='flex flex-1 flex-col justify-center px-[clamp(1rem,2.4vw,1.75rem)] py-[clamp(0.75rem,2.4svh,1.5rem)]'>
                  <span className='lc-display lc-scene-type block text-[clamp(1.5rem,3.6svh,2.1rem)] leading-tight'>{c.title}</span>
                  <span className='mt-1 block text-[clamp(0.85rem,1.8svh,1rem)] text-bone/70'>{c.line}</span>
                  <ul className='mt-[clamp(0.5rem,1.6svh,1rem)] grid gap-1.5 text-[clamp(0.78rem,1.6svh,0.9rem)] text-bone/55'>
                    {c.points.map((pt) => (
                      <li key={pt} className='flex items-baseline gap-2.5'>
                        <span aria-hidden className='size-1 shrink-0 translate-y-[-0.15em] rounded-full bg-(--lc-glow)' />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* The vault: the characters of all three games side by side, inside the column; scroll or use the arrows */}
      <section id='vault' aria-labelledby='lc-cross' className='lc-screen [--wash-at:85%_100%]'>
        <div className={BODY}>
          <div className='grid gap-x-12 gap-y-4 lg:grid-cols-12 lg:items-end'>
            <Heading id='lc-cross' eyebrow='The vault' className='lg:col-span-7'>
              Any character. Even across games.
            </Heading>
            <p className='lc-in max-w-[46ch] leading-relaxed text-pretty text-bone/65 lg:col-span-5 lg:pb-2' style={at(2)}>
              Your Toreador, your Glass Walker and the hunter on both their trails live in the same vault. Crossover chronicles welcome.
            </p>
          </div>
          <div className='lc-in mt-[clamp(1.25rem,4svh,3rem)] flex min-h-0 flex-1 flex-col pb-[clamp(1.5rem,6svh,4rem)]' style={at(3)}>
            <Strip label='Characters in the vault'>
              {people.map((p) => (
                <li key={p.key} data-game={p.game ?? undefined} style={p.game ? undefined : ({ '--here': 1 } as React.CSSProperties)} className='lc-bx-face snap-start'>
                  <span className='relative block h-full overflow-hidden rounded-xl'>
                    <Image src={p.game ? SCENE_OF[p.game] : '/acts/hook.webp'} alt='' fill sizes='20rem' className='lc-bx-face-scene object-cover' />
                    <Image src={p.src} width={p.width} height={p.height} alt={p.alt} sizes='24rem' className='lc-bx-face-art' />
                    <span className='absolute inset-x-0 bottom-0 bg-linear-to-t from-black/90 via-black/50 to-transparent px-4 pt-14 pb-3'>
                      <span className={clsx('text-[0.6rem] tracking-[0.22em] uppercase', p.game ? TONE[p.game] : 'text-bone/60')} style={p.game ? { color: 'var(--glow)' } : undefined}>
                        {p.game ? GAMES[p.game].name : 'Chronicles'}
                      </span>
                      <span className='lc-display mt-0.5 block truncate text-xl text-[#ece8e1]'>{p.who}</span>
                    </span>
                  </span>
                </li>
              ))}
            </Strip>
          </div>
        </div>
      </section>

      {/* Six rooms: the covers' own scenes, the chosen one marked */}
      <section id='atmospheres' aria-labelledby='lc-atmo' className='lc-screen [--wash-at:50%_0%]'>
        <div className={BODY}>
          <div className='grid gap-x-12 gap-y-4 lg:grid-cols-12 lg:items-end'>
            <Heading id='lc-atmo' eyebrow='Six themes' className='lg:col-span-7'>
              Every game has two rooms of its own.
            </Heading>
            <p className='lc-in max-w-[46ch] leading-relaxed text-pretty text-bone/65 lg:col-span-5 lg:pb-2' style={at(2)}>
              Each with its own frame, its own light and a little something that never stops moving. These are the rooms as they look inside the app.
            </p>
          </div>
          <ul className='lc-bx-rooms mt-[clamp(1.25rem,4svh,3rem)]'>
            {rooms.map((c, i) => {
              const room = ROOMS[c.id];
              return (
                <li key={c.id} data-scene={c.id} data-clip-host className='lc-in lc-in-wipe flex min-h-0 min-w-0 flex-col gap-2' style={at(i + 3)}>
                  {/* The scene alone, nothing in front of it */}
                  <div className='lc-bx-room relative min-h-0 flex-1'>
                    {SCENE_CLIPS[c.id] ? (
                      <Clip {...clip(SCENE_CLIPS[c.id])} label={`The ${c.name} theme in Elysium.`} className='lc-bx-room-art absolute inset-0 size-full object-cover' />
                    ) : (
                      <Image src={c.scene.src} alt='' fill sizes='(max-width: 640px) 100vw, 30rem' style={{ objectPosition: c.scene.position }} className={clsx('lc-bx-room-art object-cover', c.scene.flip && '-scale-x-100')} />
                    )}
                  </div>
                  <p className='flex items-baseline justify-between gap-x-3 px-1' title={`${room.frame} · ${room.loop}`}>
                    <span className='lc-display truncate text-[clamp(1.05rem,2.4svh,1.35rem)] leading-tight'>{c.name}</span>
                    <span className={clsx('shrink-0 text-[0.6rem] tracking-[0.25em] uppercase', TONE[c.game])} style={{ color: 'var(--glow)' }}>
                      {GAMES[c.game].name}
                      <span className='inline-block max-w-[calc(var(--here,0)*5rem)] overflow-hidden align-bottom whitespace-pre'> · Yours</span>
                    </span>
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Dice */}
      <section id='dice' aria-labelledby='lc-dice' className='lc-screen [--wash-at:50%_100%]'>
        <div aria-hidden className='pointer-events-none absolute inset-0 z-0 overflow-hidden mask-[linear-gradient(transparent,#000_22%,#000_72%,transparent)]'>
          <Image src='/locations/location-53.webp' alt='' fill sizes='100vw' className='lc-bx-drift object-cover object-[center_40%] opacity-45' />
        </div>
        <div className={BODY}>
          {/* Two columns: the three games' dice on the left, one clip of all three rollers on the right (a still until hovered). */}
          <div className='grid min-h-0 flex-1 gap-x-12 gap-y-[clamp(1.25rem,4svh,2.5rem)] lg:grid-cols-12 lg:items-center'>
            <div className='flex flex-col lg:col-span-5'>
              <Heading id='lc-dice' eyebrow='The dice'>
                The real dice, rolled in 3D.
              </Heading>
              <p className='lc-in mt-4 max-w-[46ch] leading-relaxed text-pretty text-bone/65' style={at(2)}>
                Every game rolls its own d10s by its own rules, in a tray of its own. The roller counts the successes and names the result, so the table can get on with the story.
              </p>
              <ul className='mt-[clamp(1rem,3.5svh,2rem)] grid gap-2'>
                {DICE.map((d, i) => (
                  <li key={d.game} className={clsx('lc-in', TONE[d.game])} style={at(i + 3)}>
                    <Link
                      href={gamePath(d.game, '/dice')}
                      className='group flex items-center gap-4 rounded-xl border border-bone/10 bg-[#0a0809]/45 p-3 backdrop-blur-[3px] transition-[border-color,background-color] duration-500 hover:border-(--glow) hover:bg-[#0a0809]/70 focus-visible:outline-2 focus-visible:outline-bone'
                    >
                      <span className='flex shrink-0 -space-x-3'>
                        {d.dice.map((name, j) => (
                          <span key={name} className='lc-in-die block' style={at(i + j + 4)}>
                            <Image src={`/dice/official/${name}.webp`} width={309} height={339} alt='' className={clsx('w-11 drop-shadow-[0_0.5rem_0.6rem_rgb(0_0_0/0.6)] transition duration-700 ease-(--ease-spring) group-hover:-translate-y-1', j ? 'group-hover:rotate-12' : 'group-hover:-rotate-12')} />
                          </span>
                        ))}
                      </span>
                      <span className='min-w-0'>
                        <span className='lc-display block text-[clamp(1.2rem,2.6svh,1.5rem)] leading-tight transition-colors duration-500 group-hover:text-(--glow)'>
                          {GAMES[d.game].name} <span className='text-[0.65em] text-bone/45'>· {d.special}</span>
                        </span>
                        <span className='block text-[0.75rem] leading-snug text-bone/55'>{d.line}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <figure data-clip-host className='lc-in lc-in-wipe relative aspect-[16/10] w-full self-center overflow-hidden rounded-xl border border-bone/15 bg-[#050405] shadow-[0_2rem_4rem_-2rem_rgb(0_0_0/0.8)] lg:col-span-7' style={at(4)}>
              <Clip {...clip('dice-all')} label='Rolling Vampire, Werewolf and Hunter dice in Elysium, one after another.' className='absolute inset-0 size-full object-cover' />
              <figcaption className='sr-only'>The dice roller in each of the three games.</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Chronicles: coming soon, then out as a beta */}
      <section id='chronicles' aria-labelledby='lc-chron' className='lc-screen [--wash-at:50%_50%]'>
        <div className={BODY}>
          <div className='grid gap-x-12 gap-y-4 lg:grid-cols-12 lg:items-end'>
            <Heading id='lc-chron' eyebrow='Chronicles' className='lg:col-span-7'>
              Sit down at the table together.
            </Heading>
            <p className='lc-in max-w-[46ch] leading-relaxed text-pretty text-bone/65 lg:col-span-5 lg:pb-2' style={at(2)}>
              Bring your coterie, pack or cell to one table. A Storyteller, or the Storyteller bot, runs the scene; everyone takes their turn, rolls in the open and votes on what happens next.
            </p>
          </div>
          <figure className='lc-in lc-in-wipe relative mt-[clamp(1.25rem,4svh,3rem)] min-h-64 flex-1 overflow-hidden rounded-xl border border-(--lc-glow)/45 shadow-[0_0_3rem_-1rem_color-mix(in_oklab,var(--lc-glow)_60%,transparent)]' style={at(3)}>
            <Image src={CHRONICLE_SHOT.src} alt={CHRONICLE_SHOT.alt} fill sizes='(max-width: 72rem) 100vw, 72rem' className='object-cover object-top brightness-80 saturate-[.85]' />
            <span aria-hidden className='absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent' />
            <figcaption className='absolute inset-x-0 bottom-0 px-[clamp(1rem,3vw,2rem)] py-[clamp(1rem,3svh,2rem)]'>
              <span className='mb-3 inline-flex items-center gap-2 rounded-full border border-(--lc-glow) bg-[color-mix(in_oklab,var(--lc-glow)_22%,rgb(10_8_9/0.7))] px-3 py-1.5 text-[0.65rem] tracking-[0.24em] uppercase shadow-[0_0_1.5rem_-0.3rem_var(--lc-glow)]'>Coming soon</span>
              <span className='lc-display lc-scene-type block text-[clamp(1.5rem,4svh,2.4rem)] leading-tight'>Chronicles open as a beta.</span>
              <span className='mt-1 block max-w-[52ch] text-sm text-bone/70'>Turns, shared rolls, the Storyteller bot and votes. Make your character now and bring them to the first table.</span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* The last call, the chosen character back at the edge, and the footer */}
      <section aria-labelledby='lc-last' className='lc-screen lc-bx-last [--wash-at:70%_60%]'>
        <div aria-hidden className='pointer-events-none absolute inset-0 z-0 overflow-hidden mask-[linear-gradient(transparent,#000_22%,#000_72%,transparent)]'>
          {COVERS.map((c) => (
            <div key={c.id} data-scene={c.id} className='lc-bx-return'>
              <Image src={c.src} alt='' width={c.width} height={c.height} sizes='(max-width: 768px) 100vw, 48rem' className='h-full w-auto max-w-none' />
            </div>
          ))}
        </div>
        <div className={clsx(BODY, 'justify-center pb-[clamp(1rem,4svh,3rem)]')}>
          <div className='max-w-2xl'>
            <p className='lc-eyebrow text-(--lc-glow-text) lc-in' style={at(0)}>
              The night is young
            </p>
            <h2 id='lc-last' className='lc-display lc-scene-type lc-in lc-in-curtain mt-5 text-[clamp(2.8rem,9svh,5.5rem)] leading-[0.98] text-balance' style={at(1)}>
              Who are you bringing into the night?
            </h2>
            <div className='lc-in mt-[clamp(1.5rem,5svh,3rem)] flex flex-wrap gap-3' style={at(3)}>
              <Link href='/vault/new' className='lc-btn lc-btn-cover lc-btn-ghost lc-btn-glow'>
                Create a character
                <MdArrowOutward aria-hidden />
              </Link>
            </div>
          </div>
        </div>
        <div className='lc-in relative' style={at(5)}>
          <Footer />
        </div>
      </section>
    </div>
  );
}
