import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import { FaPowerOff } from 'react-icons/fa';
import {
  VtmLogo,
  VtmAnkh,
  Elysium1,
  AnarchLogo,
  SabbatLogo,
} from '@/app/ui/svgs';
import { GiDove, GiD10 } from 'react-icons/gi';
// import { signOut } from '@/auth';

export default function SideNav() {
  return (
    <div className='z-50 fixed top-0 md:relative flex bg-black md:h-full w-full flex-col px-2 pb-2 xl:py-2 md:px-2 border border-slate-300/50 rounded-xl'>
      {/* md:flex-col md:items-center md:justify-center */}
      <div className='mb-2 flex items-center justify-between md:justify-center bg-black h-14 md:h-16 rounded-md translate-y-2'>
        <div className='logo text-slate-300'>
          <Link href='/'>
            <Elysium1 className=' text-slate-300/80 drop-shadow-[0_0_0.3rem_#ffffff70] w-36 md:w-28 lg:w-40' />
            {/* <GiDove className='text-2xl md:text-3xl mb-1 mr-2 md:mr-2' />
            <p className='relative text-2xl md:text-3xl md:ml-2'>Elysium</p> */}
          </Link>
        </div>
        {/* <div className='flex items-start md:hidden text-slate-300'>
          <VtmAnkh className=' text-slate-300/80 drop-shadow-[0_0_0.3rem_#ffffff70] w-5  mb-2 ml-2' />
          <AnarchLogo className=' text-slate-300/80 drop-shadow-[0_0_0.3rem_#ffffff70] w-6  mb-2 ml-2' />
          <SabbatLogo className=' text-slate-300/80 drop-shadow-[0_0_0.3rem_#ffffff70] w-12  mb-2' />
        </div> */}
      </div>

      <div className='bottom-0 flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2 mt-2'>
        <NavLinks />
        <div className='hidden h-auto w-full grow bg-black md:block rounded-md'>
          <div className='flex flex-col items-center justify-center mt-12'>
            <VtmAnkh className='text-xl text-rose-600/70 dark:text-red-800/70 w-28' />
          </div>
        </div>
        <div>
          <Link href='https://vtm-diceroll.netlify.app/' target='_blank'>
            <button className='flex h-[48px] w-full grow items-center rounded-md justify-center gap-2 bg-black p-3 text-base text-slate-300 border border-slate-300/50 dark:hover:bg-red-800 dark:hover:border-red-800 hover:bg-rose-600 duration-500 ease-in-out md:flex-none md:justify-start md:p-2 md:px-3 '>
              <GiD10 className='w-6' />
              <div className='hidden md:block mt-1'>Dice Roller</div>
            </button>
          </Link>
        </div>
        <form
          action={async () => {
            'use server';
            // await signOut();
          }}
        >
          <button className='flex h-[48px] w-full grow items-center rounded-md justify-center gap-2 bg-black p-3 text-base text-slate-300 border border-slate-300/50 dark:hover:bg-red-800 dark:hover:border-red-800 hover:bg-rose-600 duration-500 ease-in-out md:flex-none md:justify-start md:p-2 md:px-3 '>
            <FaPowerOff className='w-6' />
            <div className='hidden md:block mt-1'>Log Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
