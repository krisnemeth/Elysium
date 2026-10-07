import Image from 'next/image';
import Link from 'next/link';
import type { Character } from '@/app/lib/sample-characters';

/*
  The cell's files as a vertical stack: each file is sticky, so as you scroll
  the next one slides up over the last and they pile up like folders.
*/
export default function CellFiles({ files }: { files: Character[] }) {
  return (
    <ol className='relative flex flex-col gap-10 pb-[30vh]'>
      {files.map((c, i) => (
        <li key={c.slug} className='sticky' style={{ top: `calc(7rem + ${i * 1.1}rem)` }}>
          <article className='group relative mx-auto max-w-3xl'>
            {/* Folder tab */}
            <div
              className='relative z-10 ml-6 inline-flex items-center gap-3 rounded-t-lg bg-[#b38d55] px-4 py-1.5 font-display text-xs tracking-[0.15em] text-[#2b2119] uppercase'
              style={{ marginLeft: `${1.5 + (i % 4) * 4}rem` }}
            >
              File {String(i + 1).padStart(3, '0')} · {c.faction}
            </div>
            {/* Folder and the paper inside it */}
            <div className='rounded-lg rounded-tl-none bg-[#b38d55] p-2 shadow-[0_-0.5rem_2rem_-0.5rem_rgb(0_0_0/0.55)] transition-transform duration-500 ease-(--ease-out-expo) group-hover:-translate-y-1'>
              <div className='relative grid gap-6 rounded-md bg-[#c9a76a] p-5 text-[#2b2119] [background-image:repeating-linear-gradient(to_bottom,transparent_0,transparent_1.6rem,rgb(43_33_25/0.1)_1.6rem,rgb(43_33_25/0.1)_calc(1.6rem+1px))] grid-cols-[6.5rem_1fr] sm:grid-cols-[10rem_1fr] md:p-7'>
                <div className='relative'>
                  <Image src={c.image.src} width={320} height={420} alt={`Photo of ${c.name}.`} className='w-full rotate-[-2deg] border-[6px] border-white object-cover shadow-md sepia-[0.3]' />
                  {/* Paper clip */}
                  <span aria-hidden className='absolute -top-3 left-6 h-10 w-3 rounded-full border-2 border-[#8d8d8d]' />
                </div>
                <div className='flex flex-col'>
                  <h2 className='font-display text-2xl leading-tight sm:text-3xl'>{c.name}</h2>
                  <dl className='mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm'>
                    <dt className='uppercase opacity-60'>Creed</dt>
                    <dd>{c.faction}</dd>
                    <dt className='uppercase opacity-60'>Status</dt>
                    <dd>{c.status === 'draft' ? 'Open' : 'Active'}</dd>
                  </dl>
                  <p className='mt-4 text-sm leading-relaxed'>{c.description}</p>
                  <Link href='/vault/hunter/new' className='mt-5 self-start border-b border-[#2b2119]/40 pb-0.5 text-sm uppercase transition-colors hover:border-accent hover:text-accent'>
                    Open file &rarr;
                  </Link>
                </div>
                <span
                  aria-hidden
                  className={`pointer-events-none absolute top-5 right-5 rotate-[-10deg] border-[3px] px-3 py-0.5 font-display text-lg tracking-[0.15em] uppercase opacity-80 ${
                    c.status === 'draft' ? 'border-[#b3151b] text-[#b3151b]' : 'border-[#2f5d3a] text-[#2f5d3a]'
                  }`}
                >
                  {c.status === 'draft' ? 'Open' : 'Verified'}
                </span>
              </div>
            </div>
          </article>
        </li>
      ))}
    </ol>
  );
}
