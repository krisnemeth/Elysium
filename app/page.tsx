import Image from 'next/image';
import { Jslab, Jsans } from './fonts';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Character Vault',
};

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-16'>
      <div className='z-10 max-w-7xl w-full items-center justify-between text-sm lg:flex'>
        <p
          className={`${Jslab.className} font-extrabold fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-red-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30`}
        >
          <Image
            src='/VTM-ANKH.svg'
            alt='Vercel Logo'
            className='dark:invert'
            width={12}
            height={5}
            priority
          />
        </p>

        <div className='fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none'>
          <a
            className={`${Jslab.className} font-extrabold pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0`}
            href='#'
            target='_blank'
            rel='noopener noreferrer'
          >
            <button
              className={`${Jslab.className} text-base font-extrabold fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-red-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30`}
            >
              Log In &rarr;
            </button>
          </a>
        </div>
      </div>

      <div className=''>
        <div className='flex items-center justify-center mb-4'>
          <p className={`${Jslab.className} font-semibold text-lg`}>
            Welcome to the
          </p>
        </div>
        <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[280px] after:w-full sm:after:w-[240px] after:translate-x-1/2 after:bg-gradient-conic after:from-sky-200 after:via-violet-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-violet-700 before:dark:opacity-10 after:dark:from-violet-900 after:dark:via-[#991b1b] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
          {/* #991b1b #0141ff*/}

          <Image
            className='relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert'
            src='/VTM-LOGO.svg'
            alt='Next.js Logo'
            width={500}
            height={37}
            priority
          />
        </div>
        <h1
          className={`${Jslab.className} text-5xl font-extrabold text-center p-8`}
        >
          Character Vault
        </h1>
      </div>

      <div className='z-10 max-w-7xl w-full items-center justify-between text-sm lg:flex'>
        <div className='grid grid-cols-2 gap-16'>
          <div className='flex flex-col gap-4 border-2 fixed left-0 top-0 w-full justify-center border-b border-red-800 bg-gradient-to-b from-zinc-100 pb-6 pt-8 backdrop-blur-2xl dark:border-red-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30'>
            <p className='text-base font-extrabold p-4'>Get started &rarr;</p>
            <p className='text-sm px-4'>
              Create an account if you don't already have one, then you can
              start your journey into the Night.
            </p>
            <p className='text-sm pb-2 px-4'>
              You can create, edit, and delete characters, and more.
            </p>
          </div>
          <div className='flex flex-col gap-4 border-2 fixed left-0 top-0 w-full justify-center border-b border-red-800 bg-gradient-to-b from-zinc-100 pb-6 pt-8 backdrop-blur-2xl dark:border-red-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30'>
            <p className={`${Jslab.className} text-lg font-extrabold p-4`}>
              Log in &rarr;
            </p>
            <p className='text-sm px-4'>
              Add new characters, and manage your existing ones, or update your
              character sheets during sessions.
            </p>
            <p className='text-sm pb-2 px-4'>
              Remember... what could possibly go wrong?
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
