import Image from 'next/image';
import Link from 'next/link';
import { MdArrowForward, MdArrowOutward } from 'react-icons/md';
import { GiDove } from 'react-icons/gi';

export default function Navbar() {
  return (
    <div className='w-full fixed z-50'>
      <div className='flex justify-between p-2 bg-black shadow-md shadow-black rounded-lg bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-75 md:border border-slate-300/50 md:mx-36 lg:mx-20 xl:mx-20 md:mt-1 lg:mt-1.5 xl:mt-2.5 h-12 lg:h-16 '>
        <div className='z-50 relative flex items-center'>
          <div className='logo z-50 flex items-center drop-shadow-[0_0_0.3rem_#ffffff70] text-slate-100/80 divide-x-2 divide-slate-100/80'>
            <GiDove className='text-sm md:text-xl mb-1 mr-1 md:mr-2' />
            <Link href='/' className=''>
              <p className='relative text-sm md:text-xl ml-1 md:ml-2'>
                Elysium
              </p>
            </Link>
          </div>
        </div>
        <nav className='lg:block h-full lg:mt-1'>
          <ul className='z-50 flex flex-row items-center -translate-y-0.5'>
            <li className='z-50 lg:inline-block rounded-md'>
              <div className='relative group'>
                <div className='absolute -inset-0.5 bg-gradient-to-r from-rose-600 to-violet-600 rounded-sm blur-md opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 w-20 md:w-24 lg:w-28 '></div>
                <button className='relative flex items-center justify-center bg-black md:py-1 py-2 text-slate-300 rounded-md group-hover:text-slate-100 transition duration-200 ease-in-out w-20 h-10 md:w-24 lg:w-28 '>
                  <span className='text-xs md:text-sm'>
                    Log In{' '}
                    <MdArrowForward className='inline text-xs md:text-sm mb-1' />
                  </span>
                </button>
              </div>
            </li>
            <li className='z-50 lg:inline-block border border-slate-300/60 rounded-md ml-2'>
              <div className='relative group'>
                <div className='absolute -inset-0.5 bg-gradient-to-r from-rose-600 to-violet-600 rounded-sm blur-md opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 w-20 md:w-24 lg:w-28'></div>
                <button className='relative flex items-center justify-center md:px-1 md:py-1 py-2 text-slate-300 rounded-md bg-black group-hover:text-slate-100 transition duration-200 ease-in-out w-20 h-10 md:w-24 lg:w-28'>
                  <span className='text-xs md:text-sm'>
                    Sign Up{' '}
                    <MdArrowOutward className='inline text-xs md:text-sm mb-1' />
                  </span>
                </button>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
