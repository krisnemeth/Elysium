import Image from 'next/image';

const CHAPTERS = [
  {
    numeral: 'I',
    eyebrow: 'Character creation',
    title: 'Build a vampire in minutes',
    body: 'Choose a clan, spread your attribute and skill dots, pick disciplines and write the history only your Storyteller gets to read. Elysium follows the V5 sheet section by section, so nothing gets skipped.',
    image: {
      src: '/iPadCharShotsDark.png',
      width: 1920,
      height: 1440,
      alt: 'The Elysium character gallery on an iPad, showing character portraits with their clan symbols.',
    },
  },
  {
    numeral: 'II',
    eyebrow: 'Character sheets',
    title: 'The whole sheet, laid out like the book',
    body: 'Attributes, skills, disciplines, Health, Willpower, Humanity, Hunger and Blood Potency sit exactly where you expect them. Mark a track with a tap instead of hunting for an eraser.',
    image: {
      src: '/SheetShot.png',
      width: 960,
      height: 720,
      alt: 'A full Vampire: The Masquerade character sheet in Elysium, with attribute and skill dots.',
    },
  },
  {
    numeral: 'III',
    eyebrow: 'Phone & tablet',
    title: 'At the table, or on the night bus home',
    body: 'Elysium works on phones and tablets as well as it does on a laptop. It follows your system theme: Classic Masquerade in dark mode, Neon Nights in light.',
    image: {
      src: '/MobileShots.png',
      width: 960,
      height: 720,
      alt: 'Two phones showing Elysium in the Classic Masquerade and Neon Nights themes.',
    },
  },
  {
    numeral: 'IV',
    eyebrow: 'Dice roller',
    title: 'Forgot your dice? Roll here',
    body: 'A dice roller lives in your dashboard, so a missing bag of d10s never stalls a scene. Built by developer and long-time friend Gabor Pfalzer.',
    image: {
      src: '/DiceRollShot.png',
      width: 960,
      height: 720,
      alt: 'The Elysium dice roller showing a pool of ten-sided dice.',
    },
  },
];

export default function Features() {
  return (
    <section
      id='features'
      aria-labelledby='features-title'
      className='grain relative z-10 -mt-[45svh] scroll-mt-0 overflow-hidden rounded-t-[2rem] border-t border-bone/10 bg-ink pt-24 pb-32 text-bone shadow-[0_-2rem_4rem_-1rem_rgb(0_0_0/0.9)] md:rounded-t-[3rem] md:pt-32'
    >
      <div className='pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(ellipse_at_top,var(--accent-deep),transparent_70%)] opacity-50' />

      <div className='relative mx-auto max-w-6xl px-6'>
        <header className='reveal max-w-2xl'>
          <p className='text-xs tracking-[0.3em] text-accent uppercase'>
            Inside Elysium
          </p>
          <h2
            id='features-title'
            className='mt-4 font-display text-5xl leading-[0.95] font-medium tracking-tight text-balance md:text-7xl'
          >
            Your character, kept safe from the sun.
          </h2>
        </header>

        <ol className='mt-20 flex flex-col gap-28 md:mt-28 md:gap-36'>
          {CHAPTERS.map((chapter, i) => (
            <li
              key={chapter.numeral}
              className='reveal grid items-center gap-10 md:grid-cols-12 md:gap-12'
            >
              <div
                className={`md:col-span-5 ${i % 2 ? 'md:order-2 md:col-start-8' : ''}`}
              >
                <p className='flex items-baseline gap-4'>
                  <span className='font-display text-6xl leading-none text-accent italic md:text-7xl'>
                    {chapter.numeral}.
                  </span>
                  <span className='text-xs tracking-[0.3em] text-bone/60 uppercase'>
                    {chapter.eyebrow}
                  </span>
                </p>
                <h3 className='mt-6 font-display text-3xl leading-tight font-medium text-balance md:text-4xl'>
                  {chapter.title}
                </h3>
                <p className='mt-4 max-w-[52ch] leading-relaxed text-pretty text-bone/70'>
                  {chapter.body}
                </p>
              </div>

              <figure
                className={`group relative md:col-span-7 ${i % 2 ? 'md:order-1 md:col-start-1' : ''}`}
              >
                <div className='absolute -inset-6 rounded-[2rem] bg-accent/25 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100' />
                <Image
                  src={chapter.image.src}
                  width={chapter.image.width}
                  height={chapter.image.height}
                  alt={chapter.image.alt}
                  sizes='(max-width: 768px) 100vw, 40rem'
                  className='relative w-full rounded-2xl shadow-[0_2rem_4rem_-1.5rem_rgb(0_0_0/0.9)] ring-1 ring-bone/10 transition duration-500 group-hover:-translate-y-1 group-hover:ring-bone/25'
                />
              </figure>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
