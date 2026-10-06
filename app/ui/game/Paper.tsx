import type { CSSProperties, ReactNode } from 'react';

type Corner = 'tl' | 'tr' | 'bl' | 'br';

// Two or three taped corners per card, the occasional torn-off corner,
// varied by index so neighbouring cards never look the same.
const PATTERNS: { tape: Corner[]; torn?: Corner }[] = [
  { tape: ['tl', 'tr'] },
  { tape: ['tl', 'tr', 'br'], torn: 'bl' },
  { tape: ['tr', 'bl'], torn: 'br' },
  { tape: ['tl', 'tr', 'bl'] },
  { tape: ['tr', 'br'], torn: 'tl' },
  { tape: ['tl', 'bl', 'br'], torn: 'tr' },
  { tape: ['tl', 'br'] },
];

const PLACE: Record<Corner, CSSProperties> = {
  tl: { top: -10, left: -18 },
  tr: { top: -10, right: -18 },
  bl: { bottom: -10, left: -18 },
  br: { bottom: -10, right: -18 },
};
const TILT: Record<Corner, number> = { tl: -34, tr: 32, bl: 30, br: -33 };

/*
  Wraps a card in taped paper. The tape and torn corner only show in
  Hunter's inn theme (.tape / .torn-* in app/games.css); elsewhere this is
  just a wrapper.
*/
export default function Paper({ index, className = '', children }: { index: number; className?: string; children: (tornClass: string) => ReactNode }) {
  const { tape, torn } = PATTERNS[index % PATTERNS.length];
  return (
    <div className={`relative ${className}`}>
      {tape.map((corner, i) => (
        <span
          key={corner}
          aria-hidden
          className='tape'
          style={{ ...PLACE[corner], width: 72 + ((index * 7 + i * 13) % 26), rotate: `${TILT[corner] + ((index + i) % 3) * 4 - 4}deg` }}
        />
      ))}
      {children(torn ? `torn-${torn}` : '')}
    </div>
  );
}
