import Image from 'next/image';
import Link from 'next/link';
import { MdArrowOutward } from 'react-icons/md';
import { CLANS } from '@/app/lib/clans';
import { FactionMark, factionName } from '@/app/ui/game/FactionMark';
import type { Character } from '@/app/lib/sample-characters';
import { panel } from '@/app/ui/kit/styles';

export default function CharacterCard({
  character,
  style,
}: {
  character: Character;
  style?: React.CSSProperties;
}) {
  const Wordmark = character.clan ? CLANS[character.clan].Wordmark : undefined;
  const clanName = factionName(character);
  return (
    <article
      style={style}
      className={`group relative flex flex-col overflow-hidden transition-[translate,box-shadow,border-color] duration-500 ease-(--ease-out-expo) hover:-translate-y-1 hover:border-bone/25 hover:shadow-[0_2rem_4rem_-1.5rem_var(--accent-deep)] ${panel}`}
    >
      <div className='relative aspect-[4/5] overflow-hidden'>
        <Image
          src={character.image.src}
          unoptimized={character.image.unoptimized}
          width={character.image.width}
          height={character.image.height}
          alt={`Portrait of ${character.name}.`}
          sizes='(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 22rem'
          className='size-full object-cover transition-[scale,filter] duration-[1.2s] ease-(--ease-out-expo) group-hover:scale-105'
        />
        <div className='absolute inset-0 bg-linear-to-t from-ink via-ink/30 to-transparent' />
        {character.status === 'draft' && (
          <span className='absolute top-4 left-4 rounded-full border border-bone/20 bg-ink/60 px-3 py-1 text-[0.65rem] tracking-[0.2em] text-bone/80 uppercase backdrop-blur-md'>
            Draft
          </span>
        )}
        <FactionMark
          character={character}
          className='absolute top-4 right-4 h-8 max-w-10 text-bone/70 drop-shadow-[0_0_0.75rem_rgb(0_0_0/0.8)] transition-[color,scale] duration-500 ease-(--ease-spring) [--knockout:transparent] group-hover:scale-110 group-hover:text-bone'
        />
        <div className='absolute inset-x-5 bottom-4'>
          {Wordmark ? (
            <Wordmark aria-label={clanName} role='img' className='h-5 w-auto max-w-full text-accent' />
          ) : (
            <p className='text-xs tracking-[0.25em] text-accent uppercase'>{clanName}</p>
          )}
          <h2 className='mt-2 font-display text-3xl leading-tight'>{character.name}</h2>
        </div>
      </div>

      <div className='flex grow flex-col p-5 pt-3'>
        <p className='text-sm leading-relaxed text-pretty text-bone/65'>{character.description}</p>
        <div className='mt-auto flex items-center justify-between gap-3 pt-5'>
          <Link
            href={`/vault/${character.game}/characters/${character.slug}`}
            className='group/link inline-flex items-center gap-1.5 text-sm text-bone transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent'
          >
            Open sheet
            <MdArrowOutward aria-hidden className='transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5' />
          </Link>
          <span className='text-[0.65rem] tracking-[0.2em] text-bone/35 uppercase'>Loresheet soon</span>
        </div>
      </div>
    </article>
  );
}
