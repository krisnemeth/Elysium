import MaskedPortrait from './MaskedPortrait';

// The sample characters from the dashboard.
const KINDRED = [
  { name: 'Trixx Laveau', clan: 'Brujah', src: '/Female1.jpg', width: 700, height: 920, look: 'twin buns, red eyeshadow and a spiked choker' },
  { name: 'Agatha Ramalho', clan: 'Tremere', src: '/Tremere.jpg', width: 735, height: 950, look: 'braided hair and tattooed face' },
  { name: 'Claire Voyant', clan: 'Malkavian', src: '/Malkavian.jpg', width: 735, height: 1034, look: 'hands pressed to her temples in blue light' },
  { name: 'Vic Vargas', clan: 'Banu Haqim', src: '/Male1.jpg', width: 719, height: 918, look: 'shaved head, moustache and green eyes' },
  { name: "Ada O'Connor", clan: 'Lasombra', src: '/Female3.jpg', width: 671, height: 950, look: 'dark dreadlocks and violet lips' },
  { name: 'Chelsea Grimm', clan: 'Gangrel', src: '/Gangrel.jpg', width: 673, height: 950, look: 'wild dreadlocks and pale eyes' },
  { name: 'Ailah Al-Malik', clan: 'Ventrue', src: '/Ventrue.jpg', width: 375, height: 487, look: 'shaved white head and black earrings' },
  { name: 'Blake Janssen', clan: 'Nosferatu', src: '/Nosferatu.jpeg', width: 736, height: 883, look: 'a scarred, ruined face and a dark suit' },
];

export default function Coterie() {
  return (
    <section
      aria-labelledby='coterie-title'
      className='border-t border-paper/15 py-24 md:py-32'
    >
      <div className='grid gap-6 px-5 md:grid-cols-12 md:px-10'>
        <h2
          id='coterie-title'
          className='font-c-serif text-6xl leading-[0.95] text-balance md:col-span-6 md:text-7xl'
        >
          Behind every mask, a <em className='text-blood'>face</em>.
        </h2>
        <p className='max-w-[40ch] leading-relaxed text-pretty text-paper/70 md:col-span-4 md:col-start-9 md:self-end'>
          Give each vampire a portrait and Elysium files it with their clan.
          Hover to drop the Masquerade.
        </p>
      </div>

      <ul className='mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-6 [scrollbar-width:thin] md:px-10'>
        {KINDRED.map(({ name, clan, src, width, height, look }, i) => (
          <li key={name} className='w-[min(70vw,18rem)] shrink-0 snap-start'>
            <MaskedPortrait
              src={src}
              width={width}
              height={height}
              alt={`Portrait of ${name}, a ${clan} vampire with ${look}.`}
              sizes='18rem'
              className='aspect-[3/4]'
            />
            <p className='mt-3 flex justify-between font-c-mono text-[0.65rem] tracking-[0.2em] text-paper/50 uppercase'>
              <span>{String(i + 1).padStart(2, '0')} &mdash; {clan}</span>
            </p>
            <p className='mt-1 font-c-serif text-2xl'>{name}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
