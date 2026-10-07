import MaskedPortrait from './MaskedPortrait';

type Field = { label: string; value: string; redacted?: boolean };

const FIELDS: Field[] = [
  { label: 'Subject', value: 'Vic Vargas' },
  { label: 'Clan', value: 'Banu Haqim' },
  { label: 'Generation', value: '11th' },
  { label: 'Predator type', value: 'Alleycat' },
  { label: 'Sire', value: 'Malika of the Judges', redacted: true },
  { label: 'Haven', value: 'Third floor, Ruskin Street', redacted: true },
  { label: 'Touchstone', value: 'His sister, Inés', redacted: true },
];

const TRACKS = [
  { label: 'Blood Sorcery', dots: 2 },
  { label: 'Celerity', dots: 3 },
  { label: 'Obfuscate', dots: 2 },
  { label: 'Humanity', dots: 6, max: 10 },
];

function Redacted({ children }: { children: string }) {
  return (
    <span
      tabIndex={0}
      className='cursor-help bg-night text-transparent transition-colors duration-300 outline-none select-none hover:bg-transparent hover:text-night focus-visible:bg-transparent focus-visible:text-night'
    >
      {children}
    </span>
  );
}

export default function Dossier() {
  return (
    <section
      id='dossier'
      aria-labelledby='dossier-title'
      className='scroll-mt-4 bg-paper px-5 py-24 text-night md:px-10 md:py-32'
    >
      <div className='grid gap-16 md:grid-cols-12'>
        <div className='md:col-span-5'>
          <p className='font-c-mono text-xs tracking-[0.25em] text-blood uppercase'>
            Exhibit A &mdash; the character sheet
          </p>
          <h2
            id='dossier-title'
            className='mt-6 font-c-serif text-6xl leading-[0.95] text-balance md:text-7xl'
          >
            Every Kindred leaves a paper&nbsp;trail.
          </h2>
          <p className='mt-8 max-w-[44ch] text-lg leading-relaxed text-pretty text-night/75'>
            Make sure it&apos;s yours. Each character in Elysium is a complete
            V5 sheet: clan, disciplines, predator type, touchstones and the
            secrets you only show your Storyteller.
          </p>
          <p className='mt-6 font-c-mono text-xs tracking-[0.15em] text-night/50 uppercase'>
            Hover or tab to the black bars to declassify.
          </p>
        </div>

        <article
          aria-label='Sample character file for Vic Vargas'
          className='relative border border-night/80 bg-paper shadow-[12px_12px_0_var(--color-night)] md:col-span-6 md:col-start-7 md:-rotate-1'
        >
          <header className='flex items-center justify-between border-b border-night/80 px-5 py-3 font-c-mono text-[0.65rem] tracking-[0.2em] uppercase'>
            <span>File 0417-K</span>
            <span className='text-blood'>Eyes only</span>
          </header>

          <div className='grid gap-6 p-5 sm:grid-cols-[9rem_1fr]'>
            <MaskedPortrait
              src='/Male1.jpg'
              width={719}
              height={918}
              alt='Portrait of Vic Vargas, a bald Banu Haqim vampire with a moustache and green eyes.'
              sizes='9rem'
              className='aspect-[3/4] w-36'
            />
            <dl className='grid content-start gap-x-4 gap-y-2 font-c-mono text-xs sm:grid-cols-[auto_1fr]'>
              {FIELDS.map(({ label, value, redacted }) => (
                <div key={label} className='contents'>
                  <dt className='tracking-[0.15em] text-night/50 uppercase'>
                    {label}
                  </dt>
                  <dd className='mb-2 sm:mb-0'>
                    {redacted ? <Redacted>{value}</Redacted> : value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <ul className='grid gap-3 border-t border-night/80 p-5 font-c-mono text-xs'>
            {TRACKS.map(({ label, dots, max = 5 }) => (
              <li key={label} className='flex items-center justify-between gap-4'>
                <span className='tracking-[0.15em] uppercase'>{label}</span>
                <span
                  aria-label={`${dots} of ${max}`}
                  className='flex gap-1.5'
                >
                  {Array.from({ length: max }, (_, i) => (
                    <span
                      key={i}
                      className={`size-2.5 rotate-45 border border-night ${i < dots ? 'bg-night' : ''}`}
                    />
                  ))}
                </span>
              </li>
            ))}
          </ul>

          <p
            aria-hidden
            className='pointer-events-none absolute top-24 -right-4 rotate-12 border-4 border-blood px-4 py-1 font-c-sans text-3xl font-black tracking-[0.1em] text-blood uppercase opacity-80 [font-variation-settings:"wdth"_62] md:text-4xl'
          >
            Kindred
          </p>
        </article>
      </div>
    </section>
  );
}
