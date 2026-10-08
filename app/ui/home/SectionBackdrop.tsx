import Image from 'next/image';

/*
  A location illustration (from the Dark Pack asset pack) filling a landing
  section: faded into the page only at the top and bottom edges, lightly
  dimmed, so the scene stays visible and the text readable. The section needs
  `relative isolate`.
*/
export default function SectionBackdrop({ src, position = 'center', strength = 0.85 }: { src: string; position?: string; strength?: number }) {
  return (
    <div aria-hidden className='pointer-events-none absolute inset-0 -z-10 overflow-hidden'>
      <Image src={src} alt='' fill sizes='100vw' className='object-cover' style={{ objectPosition: position, opacity: strength }} />
      <div className='absolute inset-0 bg-ink/30' />
      <div className='absolute inset-x-0 top-0 h-40 bg-linear-to-b from-ink to-transparent' />
      <div className='absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-ink to-transparent' />
      <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgb(0_0_0/0.45)_100%)]' />
    </div>
  );
}
