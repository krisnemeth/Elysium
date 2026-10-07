import Image from 'next/image';
import Link from 'next/link';
import Stagger from '@/app/ui/kit/Stagger';
import { panel } from '@/app/ui/kit/styles';
import type { Character } from '@/app/lib/sample-characters';
import { FactionMark } from '@/app/ui/game/FactionMark';

// The pack: tall portraits in arched, cave-mouth frames.
export default function Pack({ members }: { members: Character[] }) {
  return (
    <Stagger className='grid gap-6 sm:grid-cols-2 xl:grid-cols-3'>
      {members.map((c) => (
        <article key={c.slug} className={`group flex flex-col p-4 transition-[translate,box-shadow] duration-700 ease-(--ease-out-expo) hover:-translate-y-1.5 hover:shadow-[0_2rem_4rem_-1.5rem_var(--accent)] ${panel}`}>
          <div className='relative overflow-hidden rounded-t-[999px] rounded-b-2xl'>
            <Image src={c.image.src} width={c.image.width} height={c.image.height} alt={`Portrait of ${c.name}.`} sizes='(max-width: 640px) 100vw, 22rem' className='aspect-[3/4] w-full object-cover transition duration-[1.2s] ease-(--ease-out-expo) group-hover:scale-105' />
            <div className='absolute inset-0 bg-linear-to-t from-ink via-transparent to-transparent' />
            {c.status === 'draft' && (
              <span className='absolute top-1/4 left-4 rounded-full border border-bone/20 bg-ink/60 px-3 py-1 text-[0.65rem] tracking-[0.2em] uppercase backdrop-blur-md'>Draft</span>
            )}
            <FactionMark character={c} className='absolute bottom-4 left-1/2 size-14 -translate-x-1/2 text-bone/85 drop-shadow-[0_0_0.75rem_rgb(0_0_0/0.9)] transition duration-500 ease-(--ease-spring) group-hover:scale-110 group-hover:text-accent' />
          </div>
          <div className='mt-4 text-center'>
            <h2 className='font-display text-2xl'>{c.name}</h2>
            <p className='mt-1 text-[0.65rem] tracking-[0.25em] text-accent uppercase'>{c.faction}</p>
            <p className='mt-3 text-sm leading-relaxed text-pretty text-bone/65'>{c.description}</p>
            <Link href='/vault/werewolf/new' className='mt-4 inline-block text-sm text-bone transition-colors hover:text-accent'>
              Open sheet &rarr;
            </Link>
          </div>
        </article>
      ))}
    </Stagger>
  );
}
