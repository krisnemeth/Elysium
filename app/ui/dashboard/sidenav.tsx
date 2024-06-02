import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import { FaPowerOff } from 'react-icons/fa';
import { VtmLogo, VtmAnkh } from '@/app/ui/svgs';
import { GiDove } from 'react-icons/gi';
// import { signOut } from '@/auth';

export default function SideNav() {
  return (
    <div className='flex h-full flex-col px-3 py-2 md:px-2 border border-slate-300/50 rounded-xl'>
      <Link
        className='mb-2 flex items-center justify-start md:flex-col md:items-center bg-black md:justify-between p-4 h-14 md:h-16 rounded-md'
        href='/'
      >
        <div className='logo z-50 flex flex-row items-center drop-shadow-[0_0_0.3rem_#ffffff70] text-slate-300 md:-translate-y-1'>
          <GiDove className='text-2xl md:text-3xl mb-1 mr-2 md:mr-2' />
          <p className='relative text-2xl md:text-3xl md:ml-2'>Elysium</p>
        </div>
      </Link>

      <div className='bottom-0 flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2'>
        <NavLinks />
        <div className='hidden h-auto w-full grow bg-black md:block rounded-md'>
          <div className='flex flex-col items-center mt-6'>
            <VtmAnkh className='text-xl text-slate-300 w-28' />
          </div>
        </div>
        <form
          action={async () => {
            'use server';
            // await signOut();
          }}
        >
          <button className='flex h-[48px] w-full grow items-center rounded-md justify-center gap-2 bg-black dark:bg-red-950 p-3 text-base text-slate-300 border border-slate-300/50 dark:hover:bg-red-800 hover:bg-rose-600 duration-500 ease-in-out md:flex-none md:justify-start md:p-2 md:px-3 '>
            <FaPowerOff className='w-6' />
            <div className='hidden md:block mt-1'>Log Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
