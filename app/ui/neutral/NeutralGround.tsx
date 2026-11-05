import type { ReactNode } from 'react';
import './neutral.css';

// The neutral ground and its backdrop, for pages with their own shell or none.
export default function NeutralGround({ frame = 'hairline', children }: { frame?: 'none' | 'hairline' | 'corners'; children: ReactNode }) {
  return (
    <div data-neutral data-n-frame={frame} data-game='wod'>
      <div aria-hidden className='n-back'>
        <div className='n-back-image' />
        <div className='n-back-shade' />
        <div className='n-back-grain' />
      </div>
      {children}
    </div>
  );
}
