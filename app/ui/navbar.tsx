import Image from 'next/image';
import Link from 'next/link';
import { MdArrowForward, MdArrowOutward } from 'react-icons/md';
import { GiDove } from 'react-icons/gi';

export default function Navbar() {
  return (
    <div className='w-full fixed z-50'>
      <div className='flex justify-between p-2 bg-black rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-60 md:mx-36 lg:mx-72 xl:mx-96 md:mt-2 lg:mt-4 xl:mt-6 h-14 lg:h-16'>
        <div className='z-50 relative flex items-center'>
          <div className='logo z-50 flex items-center drop-shadow-[0_0_0.3rem_#ffffff70] text-slate-300 ml-4 divide-x-2 '>
            <GiDove className='text-sm md:text-2xl mb-1 mr-2 md:mr-4' />
            <Link href='/' className=''>
              <p className='relative text-sm md:text-2xl ml-2 md:ml-4'>
                Elysium
              </p>
            </Link>
          </div>
        </div>
        <nav className='lg:block h-full mr-4'>
          <ul className='z-50 flex items-center xl:mt-1'>
            <li className='z-50 lg:inline-block  rounded-lg'>
              <div className='relative group'>
                <div className='absolute -inset-0.5 bg-gradient-to-r from-rose-600 to-violet-600 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 w-20 md:w-24 lg:w-28 '></div>
                <button className='relative flex items-center justify-center bg-black px-0.5 md:py-1 py-2 text-slate-300 rounded-lg group-hover:text-slate-100 transition duration-200 ease-in-out w-20  md:w-24 lg:w-28 '>
                  <span className='text-sm md:text-base lg:text-lg'>
                    Log In{' '}
                    <MdArrowForward className='inline text-sm md:text-lg mb-1' />
                  </span>
                </button>
              </div>
            </li>
            <li className='z-50 lg:inline-block border border-slate-300 rounded-lg ml-2'>
              <div className='relative group'>
                <div className='absolute -inset-0.5 bg-gradient-to-r from-rose-600 to-violet-600 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 w-20 md:w-24 lg:w-28'></div>
                <button className='relative flex items-center justify-center px-0.5 md:px-1 md:py-1 py-2 text-slate-300 rounded-lg bg-black group-hover:text-slate-100 transition duration-200 ease-in-out w-20 md:w-24 lg:w-28'>
                  <span className='text-sm md:text-base lg:text-lg'>
                    Sign Up{' '}
                    <MdArrowOutward className='inline text-sm md:text-lg mb-1' />
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
