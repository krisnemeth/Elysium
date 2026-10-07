import Image from 'next/image';

const ENTRIES = [
  {
    word: 'Create',
    detail: 'Clan, attributes, skills and disciplines, step by step through the V5 sheet.',
    image: { src: '/iPadCharShotsDark.png', width: 1920, height: 1440, alt: 'The Elysium character gallery on an iPad.' },
  },
  {
    word: 'Track',
    detail: 'Health, Willpower, Humanity, Hunger and Blood Potency, marked with a tap.',
    image: { src: '/SheetShot.png', width: 960, height: 720, alt: 'A full character sheet in Elysium.' },
  },
  {
    word: 'Carry',
    detail: 'Phone, tablet or laptop. Your coterie, wherever the night takes you.',
    image: { src: '/MobileShots.png', width: 960, height: 720, alt: 'Elysium on two phones.' },
  },
  {
    word: 'Roll',
    detail: 'A dice roller in your dashboard, built by Gabor Pfalzer.',
    image: { src: '/DiceRollShot.png', width: 960, height: 720, alt: 'The Elysium dice roller.' },
  },
];

export default function VaultIndex() {
  return (
    <section
      aria-labelledby='index-title'
      className='border-t border-paper/15 py-24 md:py-32'
    >
      <div className='flex items-baseline justify-between px-5 md:px-10'>
        <h2
          id='index-title'
          className='font-c-mono text-xs tracking-[0.25em] text-blood uppercase'
        >
          Index of the vault
        </h2>
        <p className='font-c-mono text-xs tracking-[0.25em] text-paper/40 uppercase'>
          04 entries
        </p>
      </div>

      <ol className='mt-10 border-t border-paper/15'>
        {ENTRIES.map(({ word, detail, image }, i) => (
          <li
            key={word}
            className='group relative overflow-hidden border-b border-paper/15 transition-colors duration-500 hover:text-chalk'
          >
            <div className='absolute inset-0 origin-left scale-x-0 bg-blood transition-transform duration-500 ease-out group-hover:scale-x-100' />
            <div className='relative grid items-center gap-4 px-5 py-6 md:grid-cols-12 md:px-10 md:py-4'>
              <span className='font-c-mono text-xs text-paper/40 transition-colors group-hover:text-chalk md:col-span-1'>
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className='font-c-sans text-[clamp(3.5rem,11vw,9rem)] leading-[0.85] font-black uppercase transition-transform duration-500 [font-variation-settings:"wdth"_62] group-hover:translate-x-4 md:col-span-6'>
                {word}
              </p>
              <p className='max-w-[36ch] text-paper/60 transition duration-300 group-hover:text-chalk md:col-span-4 lg:group-hover:opacity-0'>
                {detail}
              </p>
            </div>
            <Image
              src={image.src}
              width={image.width}
              height={image.height}
              alt={image.alt}
              sizes='22rem'
              className='pointer-events-none absolute top-1/2 right-10 hidden w-[22rem] -translate-y-1/2 rotate-3 opacity-0 shadow-[0_2rem_4rem_rgb(0_0_0/0.6)] transition duration-500 group-hover:-rotate-2 group-hover:opacity-100 lg:block'
            />
          </li>
        ))}
      </ol>
    </section>
  );
}
