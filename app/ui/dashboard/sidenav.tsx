import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import { FaPowerOff } from 'react-icons/fa';
import { VtmLogo, VtmAnkh } from '@/app/ui/svgs';
import { GiDove } from 'react-icons/gi';
// import { signOut } from '@/auth';

export default function SideNav() {
  return (
    <div className='flex h-full flex-col px-3 py-2 md:px-2 bg-black/30'>
      <Link
        className='mb-2 flex h-14 items-center justify-start md:flex-col md:items-center md:justify-between bg-black p-4 md:h-20'
        href='/'
      >
        {/* <div className='w-32 md:text-center md:w-56 inline-block'>
          <VtmLogo className='relative text-2xl text-slate-300' />
        </div> */}
        <div className='logo z-50 flex flex-row items-center drop-shadow-[0_0_0.3rem_#ffffff70] text-slate-300 ml-2 mt-1'>
          <GiDove className='text-2xl md:text-4xl mb-1 mr-2 md:mr-2' />

          <p className='relative text-2xl md:text-4xl md:ml-2'>Elysium</p>
        </div>
      </Link>

      <div className='bottom-0 flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2'>
        <NavLinks />
        <div className='hidden h-auto w-full grow bg-black md:block'>
          <div className='flex flex-col items-center mt-24'>
            <VtmAnkh className='text-xl text-slate-300 w-32' />
          </div>
        </div>
        <form
          action={async () => {
            'use server';
            // await signOut();
          }}
        >
          <button className='flex h-[48px] w-full grow items-center rounded-md justify-center gap-2 bg-purple-950 dark:bg-red-950 p-3 text-lg text-slate-300 font-medium dark:hover:bg-red-800 hover:bg-purple-900 duration-500 ease-in-out md:flex-none md:justify-start md:p-2 md:px-3 '>
            <FaPowerOff className='w-6' />
            <div className='hidden md:block mt-1'>Log Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
