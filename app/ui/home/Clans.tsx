import {
  BrujahLogo,
  GangrelLogo,
  MalkavianLogo,
  NosferatuLogo,
  ToreadorLogo,
  TremereLogo,
  VentrueLogo,
  BanuHaqimLogo,
  HecataLogo,
  LasombraLogo,
  RavnosLogo,
  TzimisceLogo,
} from '@/app/ui/svgs';

const CLANS = [
  { name: 'Brujah', Logo: BrujahLogo },
  { name: 'Gangrel', Logo: GangrelLogo },
  { name: 'Malkavian', Logo: MalkavianLogo },
  { name: 'Nosferatu', Logo: NosferatuLogo },
  { name: 'Toreador', Logo: ToreadorLogo },
  { name: 'Tremere', Logo: TremereLogo },
  { name: 'Ventrue', Logo: VentrueLogo },
  { name: 'Banu Haqim', Logo: BanuHaqimLogo },
  { name: 'Hecata', Logo: HecataLogo },
  { name: 'Lasombra', Logo: LasombraLogo },
  { name: 'Ravnos', Logo: RavnosLogo },
  { name: 'Tzimisce', Logo: TzimisceLogo },
];

export default function Clans() {
  return (
    <section
      id='clans'
      aria-labelledby='clans-title'
      className='relative z-10 bg-ink pb-32 text-bone'
    >
      <div className='mx-auto max-w-6xl px-6'>
        <div className='reveal grid gap-6 border-t border-bone/10 pt-20 md:grid-cols-12'>
          <h2
            id='clans-title'
            className='font-display text-4xl leading-tight font-medium text-balance md:col-span-5 md:text-5xl'
          >
            Every clan keeps a seat at Elysium.
          </h2>
          <p className='max-w-[52ch] leading-relaxed text-pretty text-bone/70 md:col-span-6 md:col-start-7 md:mt-2'>
            Elysium is neutral ground, and so is the vault. Bring your
            Camarilla elders, Anarch rebels and the clans the Ivory Tower would
            rather forget. Each sheet carries its clan&apos;s symbol and bane.
          </p>
        </div>

        <ul className='reveal mt-16 grid grid-cols-3 gap-px overflow-hidden rounded-2xl bg-bone/10 sm:grid-cols-4 lg:grid-cols-6'>
          {CLANS.map(({ name, Logo }) => (
            <li
              key={name}
              className='group flex aspect-square flex-col items-center justify-center gap-4 bg-ink transition-colors duration-500 hover:bg-accent-deep/40'
            >
              <Logo
                aria-hidden
                className='h-10 w-10 text-bone/50 transition duration-500 group-hover:scale-110 group-hover:text-bone group-hover:drop-shadow-[0_0_0.75rem_var(--accent)] md:h-12 md:w-12'
              />
              <span className='text-[0.65rem] tracking-[0.25em] text-bone/50 uppercase transition-colors duration-500 group-hover:text-bone md:text-xs'>
                {name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
