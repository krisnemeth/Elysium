import type { CSSProperties, ReactNode } from 'react';

/*
  A V5 d10 (pentagonal trapezohedron) seen face-on, drawn like the official
  dice: a bright front face and four shaded side faces. --die sets the base
  colour, so dice follow the theme (Hunger dice use the accent colour).
*/

// viewBox 0 0 100 110
const T = '50,1';
const UL = '1,44';
const LL = '1,70';
const B = '50,109';
const LR = '99,70';
const UR = '99,44';
const FL = '17,70';
const FB = '54,79';
const FR = '84,69';

const shade = (pct: number) => `color-mix(in oklab, var(--die) ${pct}%, black)`;

export default function D10({
  hunger = false,
  children,
  className = '',
  style,
}: {
  hunger?: boolean;
  // Symbol/number drawn on the front face.
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      style={
        {
          '--die': hunger ? 'var(--die-hunger, var(--accent))' : 'var(--die-regular, #3a3a3a)',
          ...style,
        } as CSSProperties
      }
      className={`relative inline-grid aspect-[100/110] place-items-center ${hunger ? 'text-black/85' : 'text-chalk'} ${className}`}
    >
      <svg viewBox='0 0 100 110' aria-hidden className='absolute inset-0 size-full overflow-visible drop-shadow-[0_0.5rem_0.75rem_rgb(0_0_0/0.5)]'>
        <polygon points={`${T} ${UL} ${LL} ${FL}`} fill={shade(78)} />
        <polygon points={`${FL} ${LL} ${B} ${FB}`} fill={shade(52)} />
        <polygon points={`${T} ${UR} ${LR} ${FR}`} fill={shade(45)} />
        <polygon points={`${FB} ${FR} ${LR} ${B}`} fill={shade(32)} />
        <polygon points={`${T} ${FR} ${FB} ${FL}`} fill='var(--die)' />
        {/* Soft highlight along the top edges */}
        <polyline points={`${FL} ${T} ${FR}`} fill='none' stroke='white' strokeOpacity='0.18' strokeWidth='1' />
      </svg>
      {/* Front-face content sits in the upper part of the kite */}
      <span className='relative -mt-[18%] grid h-[44%] place-items-center'>{children}</span>
    </span>
  );
}
