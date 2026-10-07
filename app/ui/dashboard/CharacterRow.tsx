import Image from 'next/image';
import Link from 'next/link';
import { FactionMark, factionName } from '@/app/ui/game/FactionMark';
import type { Character } from '@/app/lib/sample-characters';

export default function CharacterRow({ character, style }: { character: Character; style?: React.CSSProperties }) {
  const clanName = factionName(character);
  return (
    <li style={style}>
      <Link
        href={`/vault/${character.game}/characters/${character.slug}`}
        className='group flex items-center gap-4 rounded-xl p-2 transition-[background-color,translate] duration-300 ease-(--ease-out-expo) hover:translate-x-1 hover:bg-bone/[0.05] focus-visible:outline-2 focus-visible:outline-accent'
      >
        <span className='relative size-12 shrink-0 overflow-hidden rounded-lg ring-1 ring-bone/10'>
          <Image
            src={character.image.src}
            unoptimized={character.image.unoptimized}
            width={96}
            height={96}
            alt=''
            className='size-full object-cover transition-transform duration-500 ease-(--ease-out-expo) group-hover:scale-110'
          />
        </span>
        <span className='min-w-0 grow'>
          <span className='block truncate font-display text-xl leading-tight'>{character.name}</span>
          <span className='block text-xs tracking-[0.15em] text-bone/45 uppercase'>{clanName}</span>
        </span>
        <FactionMark
          character={character}
          className='h-7 max-w-9 shrink-0 text-bone/35 transition-[color,scale] duration-500 ease-(--ease-spring) [--knockout:var(--color-ink)] group-hover:scale-110 group-hover:text-accent'
        />
      </Link>
    </li>
  );
}
