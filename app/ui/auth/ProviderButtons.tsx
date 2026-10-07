import { FaDiscord, FaGoogle } from 'react-icons/fa';
import { signInWithProvider } from '@/app/lib/actions/auth';

const btn =
  'flex w-full items-center justify-center gap-3 rounded-xl border border-bone/15 bg-bone/[0.04] px-4 py-3 text-sm text-bone transition duration-300 hover:border-bone/35 hover:bg-bone/[0.08] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bone';

export default function ProviderButtons({ next = '/vault' }: { next?: string }) {
  return (
    <div className='flex flex-col gap-3'>
      <form action={signInWithProvider.bind(null, 'google', next)}>
        <button className={btn}>
          <FaGoogle aria-hidden className='size-4' /> Continue with Google
        </button>
      </form>
      <form action={signInWithProvider.bind(null, 'discord', next)}>
        <button className={btn}>
          <FaDiscord aria-hidden className='size-5' /> Continue with Discord
        </button>
      </form>
      <div className='my-3 flex items-center gap-3 text-xs tracking-[0.2em] text-bone/40 uppercase'>
        <span className='h-px grow bg-bone/15' /> or <span className='h-px grow bg-bone/15' />
      </div>
    </div>
  );
}
