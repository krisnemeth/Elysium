import Image from 'next/image';
import Link from 'next/link';
import { MdArrowForward, MdArrowOutward } from 'react-icons/md';
import { GiDove } from 'react-icons/gi';

export default function Navbar() {
  return (
    <div className='w-full absolute'>
      <div className='flex justify-between p-2 bg-black rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-60 xl:mx-80 md:mt-6'>
        <div className='z-50 relative flex items-center '>
          <div className='logo z-50 flex items-center drop-shadow-[0_0_0.3rem_#ffffff70] text-slate-300 ml-4 divide-x-2 '>
            <GiDove className='text-lg md:text-2xl mb-2 mr-2 md:mr-4' />
            <Link href='/' className=''>
              <p className='relative text-lg md:text-2xl ml-2 md:ml-4'>
                Elysium
              </p>
            </Link>
          </div>
        </div>
        <nav className='lg:block h-full'>
          <ul className='z-50 flex items-center'>
            <li className='z-50 my-2 lg:inline-block'>
              <div className='relative group'>
                <div className='absolute -inset-0.5 bg-gradient-to-r from-rose-600 to-violet-600 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 w-36'></div>
                <button className='relative flex items-center justify-center bg-black px-4 py-2 text-slate-300 rounded-lg group-hover:text-slate-100 transition duration-200 ease-in-out w-36'>
                  <span className='text-lg'>
                    Log In <MdArrowForward className='inline text-xl mb-1' />
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
