import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  return (
    <div className='absolute flex justify-between p-2 bg-black shadow-2xl w-full'>
      <div className='z-50 relative flex items-center'>
        <div className='logo z-50 flex items-center ml-10 mr-2'>
          <Image
            className='relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert'
            src='/VTM-ANKH.svg'
            alt='Next.js Logo'
            width={10}
            height={37}
            priority
          />
        </div>
        <div className='logo z-50 flex items-center'>
          {/* <Image
              className='relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert'
              src='/VTM-LOGO.svg'
              alt='Next.js Logo'
              width={100}
              height={37}
              priority
            /> */}
          <Link href='/' className=' hover:border-b hover:border-red-700'>
            <p className='relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert text-xl '>
              Character Vault
            </p>
          </Link>
        </div>
      </div>
      <div className=''>
        <nav className='hidden lg:block h-full ml-auto'>
          <ul className='z-50 flex items-center'>
            <li className='z-50 mx-2.5 lg:inline-block '>
              <Link href='/dashboard'>
                <button className='border-2 border-red-800 px-3 py-1 hover:bg-red-900 transition-colors duration-500 ease-in-out'>
                  <span className='dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert'>
                    Log In
                  </span>
                </button>
              </Link>
            </li>
            <li className='z-50 mr-10 my-2 lg:inline-block'>
              <button className='border-2 border-red-800 bg-red-800 px-3 py-1 hover:bg-red-600 hover:border-red-600 transition-colors duration-500 ease-in-out'>
                <span className='dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert'>
                  Sign Up
                </span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
