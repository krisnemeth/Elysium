import Image from 'next/image';

export default function Navbar() {
  return (
    <div className='flex justify-between p-2 bg-black shadow-2xl'>
      <div className='z-50 relative flex items-center'>
        <div className='logo z-50 flex items-center mx-5'>
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
          <p className='relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert text-xl'>
            Character Vault
          </p>
        </div>
      </div>
      <div className=''>
        <nav className='hidden lg:block h-full ml-auto'>
          <ul className='z-50 flex items-center'>
            <li className='z-50 mx-2.5 lg:inline-block '>
              <button className='border-2 border-red-800 px-3 py-1 hover:bg-red-900 transition-colors duration-500 ease-in-out'>
                <span className='dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert'>
                  Log In
                </span>
              </button>
            </li>
            <li className='z-50 mx-2.5 my-2 lg:inline-block'>
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
