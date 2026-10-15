import type { ReactNode } from 'react';

/*
  Wraps a card that is a sheet of paper (`.sheet-paper`). In Hunter's cabin the
  wrapper carries a steel clip, in the city a strip of tape, both over the top
  edge (.paper-clip in app/games.css); elsewhere this is just a wrapper. The
  clip sits a little differently on each card, by index. `children` still gets
  a class name argument (always empty) so existing callers keep working.
*/
export default function Paper({ index, className = '', children }: { index: number; className?: string; children: (extraClass: string) => ReactNode }) {
  return (
    <div className={`paper relative ${className}`}>
      <span aria-hidden className='paper-clip' style={{ left: `${40 + ((index * 17) % 22)}%` }} />
      {children('')}
    </div>
  );
}
