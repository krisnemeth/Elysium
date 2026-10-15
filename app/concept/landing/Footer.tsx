import Image from 'next/image';
import { DARK_PACK_LOGO, DARK_PACK_NOTICE, NOT_OFFICIAL_NOTICE, WORLD_OF_DARKNESS_URL } from '@/app/lib/dark-pack';

// Dark Pack notices, verbatim from app/lib/dark-pack.ts.
export default function Footer() {
  return (
    <footer className='lc-footer'>
      <div className='lc-footer-in'>
        <Image src={DARK_PACK_LOGO.src} width={DARK_PACK_LOGO.width} height={DARK_PACK_LOGO.height} alt={DARK_PACK_LOGO.alt} className='size-14 shrink-0' />
        <div>
          <p>{DARK_PACK_NOTICE}</p>
          <p className='mt-2'>{NOT_OFFICIAL_NOTICE}</p>
          <p className='mt-2'>
            <a href={WORLD_OF_DARKNESS_URL}>worldofdarkness.com</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
