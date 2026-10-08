import type { CSSProperties } from 'react';
import { CLANS } from '@/app/lib/clans';
import { glyphUrl } from '@/app/lib/factions';
import type { Character } from '@/app/lib/sample-characters';
import Glyph from '@/app/ui/dice/Glyph';

/*
  A character's faction symbol: the official clan symbol for Vampires, the
  tribe glyph for Werewolves, and the Hunter flame for Hunters (creeds have
  no official symbols).
*/
export function FactionMark({ character, className = '' }: { character: Character; className?: string }) {
  if (character.game === 'vampire' && character.clan) {
    const { Symbol } = CLANS[character.clan];
    return <Symbol aria-hidden className={`w-auto ${className}`} />;
  }
  if (character.game === 'werewolf') {
    const url = `url(${glyphUrl(character.faction)})`;
    return (
      <span
        aria-hidden
        className={`inline-block aspect-square bg-current [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] ${className}`}
        style={{ maskImage: url, WebkitMaskImage: url } as CSSProperties}
      />
    );
  }
  return <Glyph name='htr-flame.svg' className={`inline-block aspect-square ${className}`} />;
}

// Display name of the faction (clan names come from the clan list).
export function factionName(character: Character) {
  return character.game === 'vampire' && character.clan ? CLANS[character.clan].name : character.faction;
}
