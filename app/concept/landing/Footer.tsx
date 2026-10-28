import Image from 'next/image';
import Link from 'next/link';
import { Elysium1 } from '@/app/ui/svgs';
import { GAMES, GAMES_ORDER, gamePath } from '@/app/lib/games';
import { DARK_PACK_LOGO, DARK_PACK_NOTICE, NOT_OFFICIAL_NOTICE, WORLD_OF_DARKNESS_URL } from '@/app/lib/dark-pack';

// The live landing's footer; Dark Pack notices verbatim from app/lib/dark-pack.ts.
export default function Footer() {
  return (
    <footer className='lc-footer'>
      <div className='mx-auto grid max-w-6xl gap-10 md:grid-cols-12'>
        <div className='md:col-span-4'>
          <Elysium1 aria-hidden className='h-auto w-28 text-bone/80' />
          <p className='mt-4 max-w-[30ch]'>A character vault for the World of Darkness.</p>
        </div>
        <nav aria-label='Games' className='flex flex-col gap-2 md:col-span-3'>
          {GAMES_ORDER.map((g) => (
            <Link key={g} href={g === 'vampire' ? '/vampire' : gamePath(g)} className='no-underline transition-colors hover:text-bone'>
              {GAMES[g].title}
            </Link>
          ))}
        </nav>
        <div className='flex gap-4 text-xs md:col-span-5'>
          <Image src={DARK_PACK_LOGO.src} width={DARK_PACK_LOGO.width} height={DARK_PACK_LOGO.height} alt={DARK_PACK_LOGO.alt} className='size-14 shrink-0' />
          <div className='flex flex-col gap-2'>
            <p>
              {DARK_PACK_NOTICE.replace('worldofdarkness.com.', '')}
              <a href={WORLD_OF_DARKNESS_URL}>worldofdarkness.com</a>.
            </p>
            <p>{NOT_OFFICIAL_NOTICE}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
