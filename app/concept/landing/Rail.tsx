'use client';

import clsx from 'clsx';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { GAMES } from '@/app/lib/games';
import { COVERS } from './covers';

/*
  The rail that turns the cover's ring of characters, under the game logos
  (CoverPicker.tsx). Until the visitor first turns the ring, it invites a
  turn (below); each turn gives a haptic tick where the device allows
  (haptic()). Its motion is in landing.css, off under reduced motion.
*/

export type RailProps = {
  current: number;
  // Whether the ring has been turned yet (the invitations stop once it has).
  moved: boolean;
  pick: (i: number) => void;
  step: (by: 1 | -1) => void;
};

/*
  A haptic tick. Web pages can't reach a Mac's trackpad (Force Touch
  haptics aren't exposed to the web by any browser), so this covers what
  can be reached: phones with the Vibration API (Android), and iPhones on
  iOS 18+, where flipping a native switch input gives a tick.
*/
export function haptic() {
  if (typeof navigator === 'undefined') return;
  if ('vibrate' in navigator && navigator.vibrate(8)) return;
  const label = document.createElement('label');
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.setAttribute('switch', '');
  label.append(input);
  label.style.cssText = 'position:fixed;opacity:0;pointer-events:none;width:0;height:0;overflow:hidden';
  document.body.append(label);
  label.click();
  label.remove();
}

const arrowBtn = 'relative grid size-7 place-items-center rounded-md text-bone/55 transition-colors hover:text-bone focus-visible:outline-2 focus-visible:outline-bone';

/*
  The rail: a tick per character between two chevrons, the current one lit
  in its scene's colour. Until the ring is turned, a pulse of the
  character's colour runs along the rail every few seconds, from two thirds
  of the way along towards the left arrow, brightest as it reaches the
  arrowhead, which flares with it.
*/
function Rail({ current, moved, pick, step }: RailProps) {
  return (
    <div className={clsx('relative mt-1 flex items-center gap-2', !moved && 'lc-rail-calling')}>
      <span aria-hidden className='absolute top-1/2 left-1/2 h-px w-[min(20rem,70vw)] -translate-x-1/2 bg-linear-to-r from-transparent via-bone/30 to-transparent' />
      <span aria-hidden className='lc-rail-pulse' />
      <button type='button' aria-label='Previous character' onClick={() => step(-1)} className={clsx(arrowBtn, 'lc-rail-arrow')}>
        <MdChevronLeft aria-hidden className='size-5' />
      </button>
      <div role='group' aria-label='Characters' className='relative flex items-center'>
        {COVERS.map((c, i) => (
          <button
            key={c.id}
            type='button'
            onClick={() => pick(i)}
            aria-label={`${c.name}, ${GAMES[c.game].name}`}
            aria-current={i === current ? 'true' : undefined}
            className='group grid h-6 w-4 place-items-center rounded-xs focus-visible:outline-2 focus-visible:outline-bone'
          >
            <span
              aria-hidden
              className={clsx(
                'block rounded-full transition-all duration-500',
                i === current ? 'h-4 w-0.5 bg-(--lc-scene-glow) shadow-[0_0_0.5rem_var(--lc-scene-glow)]' : 'h-2 w-px bg-bone/45 group-hover:h-3 group-hover:bg-bone/80',
              )}
            />
          </button>
        ))}
      </div>
      <button type='button' aria-label='Next character' onClick={() => step(1)} className={arrowBtn}>
        <MdChevronRight aria-hidden className='size-5' />
      </button>
    </div>
  );
}

export default Rail;
