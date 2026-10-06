import Link from 'next/link';
import { LogoAnkh } from '@/app/ui/svgs/official';
import ThemeToggle from '@/app/ui/ThemeToggle';
import { buttonPrimary, buttonGhost } from '@/app/ui/kit/styles';

export default function NotFound() {
  return (
    <main className='grain relative isolate grid min-h-svh place-items-center overflow-hidden bg-ink px-6 text-bone'>
      <div className='pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_40%,var(--accent-deep),transparent_65%)] opacity-70' />
      <ThemeToggle
        labels={{ light: 'Neon Nights', dark: 'Masquerade' }}
        className='absolute top-5 right-5 rounded-xl px-3 py-2 text-xs text-bone/70 transition-colors hover:text-bone'
      />
      <div className='page-in flex max-w-md flex-col items-center text-center'>
        <LogoAnkh aria-hidden className='glow-pulse h-28 w-auto text-accent drop-shadow-[0_0_2rem_var(--accent)]' />
        <p className='mt-8 text-xs tracking-[0.3em] text-accent uppercase'>404</p>
        <h1 className='mt-3 font-display text-5xl leading-tight'>Lost in the night.</h1>
        <p className='mt-4 leading-relaxed text-bone/65'>
          This page doesn&apos;t exist, or it has slipped beneath the Masquerade.
        </p>
        <div className='mt-8 flex flex-wrap justify-center gap-3'>
          <Link href='/dashboard' className={buttonPrimary}>
            Back to the vault
          </Link>
          <Link href='/' className={buttonGhost}>
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
