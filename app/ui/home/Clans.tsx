import {
  ClanBanuHaqim,
  ClanBrujah,
  ClanCaitiff,
  ClanGangrel,
  ClanHecata,
  ClanLasombra,
  ClanMalkavian,
  ClanMinistry,
  ClanNosferatu,
  ClanRavnos,
  ClanSalubri,
  ClanThinBlood,
  ClanToreador,
  ClanTremere,
  ClanTzimisce,
  ClanVentrue,
} from '@/app/ui/svgs/official';

const CLANS = [
  { name: 'Banu Haqim', Logo: ClanBanuHaqim },
  { name: 'Brujah', Logo: ClanBrujah },
  { name: 'Gangrel', Logo: ClanGangrel },
  { name: 'Hecata', Logo: ClanHecata },
  { name: 'Lasombra', Logo: ClanLasombra },
  { name: 'Malkavian', Logo: ClanMalkavian },
  { name: 'The Ministry', Logo: ClanMinistry },
  { name: 'Nosferatu', Logo: ClanNosferatu },
  { name: 'Ravnos', Logo: ClanRavnos },
  { name: 'Salubri', Logo: ClanSalubri },
  { name: 'Toreador', Logo: ClanToreador },
  { name: 'Tremere', Logo: ClanTremere },
  { name: 'Tzimisce', Logo: ClanTzimisce },
  { name: 'Ventrue', Logo: ClanVentrue },
  { name: 'Caitiff', Logo: ClanCaitiff },
  { name: 'Thin-blood', Logo: ClanThinBlood },
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
            rather forget, down to the clanless Caitiff and the thin-blooded.
            Each sheet carries its clan&apos;s symbol and bane.
          </p>
        </div>

        <ul className='reveal mt-16 grid grid-cols-4 gap-px overflow-hidden rounded-2xl bg-bone/10 lg:grid-cols-8'>
          {CLANS.map(({ name, Logo }) => (
            <li
              key={name}
              className='group flex flex-col items-center justify-center gap-3 bg-ink px-2 py-6 sm:aspect-square sm:py-2 transition-colors duration-500 [--knockout:var(--color-ink)] hover:bg-accent-deep/40 hover:[--knockout:color-mix(in_oklab,var(--accent-deep)_40%,var(--color-ink))]'
            >
              <Logo
                aria-hidden
                className='h-9 w-auto max-w-[70%] text-bone/55 transition duration-500 group-hover:scale-110 group-hover:text-bone group-hover:drop-shadow-[0_0_0.75rem_var(--accent)] md:h-11'
              />
              <span className='text-center text-[0.6rem] tracking-[0.2em] text-bone/50 uppercase transition-colors duration-500 group-hover:text-bone md:text-[0.65rem]'>
                {name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
