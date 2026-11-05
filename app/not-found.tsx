import Link from 'next/link';
import ForceDark from '@/app/ui/ForceDark';
import { buttonGhost, buttonPrimary } from '@/app/ui/kit/styles';
import NeutralGround from '@/app/ui/neutral/NeutralGround';
import { Elysium1 } from '@/app/ui/svgs';

export default function NotFound() {
  return (
    <NeutralGround>
      <ForceDark />
      <main className='grid min-h-svh place-items-center px-6 text-bone'>
        <div className='page-in flex max-w-md flex-col items-center text-center'>
          <Elysium1 aria-hidden className='h-auto w-40 text-bone/90' />
          <p className='mt-8 text-xs tracking-[0.3em] text-bone/60 uppercase'>404</p>
          <h1 className='mt-3 font-display text-5xl leading-tight'>Lost in the night.</h1>
          <p className='mt-4 leading-relaxed text-bone/65'>This page doesn&apos;t exist, or the dark has already claimed it.</p>
          <div className='mt-8 flex flex-wrap justify-center gap-3'>
            <Link href='/vault' className={buttonPrimary}>
              Back to the vault
            </Link>
            <Link href='/' className={buttonGhost}>
              Home
            </Link>
          </div>
        </div>
      </main>
    </NeutralGround>
  );
}
