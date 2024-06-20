import React from 'react';
import Image from 'next/image';
import GlowUpButtonMedium from '../glowUpButtonMedium';
import {
  FaSquareXTwitter,
  FaSquareInstagram,
  FaSquareYoutube,
} from 'react-icons/fa6';
import { AiFillTikTok } from 'react-icons/ai';

import { MdArrowOutward } from 'react-icons/md';

// import LogoGrid from './LogoGrid';

export default function Footer() {
  let currentYear = new Date().getFullYear();
  return (
    <>
      {/* GRID */}
      <div className='w-full md:my-2 lg:my-0 bg-gradient-to-t from-black to-violet-950 dark:to-red-950 bg-opacity-100 pb-10 pt-24 border'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-2 md:gap-10 mx-2 mb-6 md:mb-0 px-4 md:px-10 '>
          <div className='flex flex-col col-span-6 w-full h-full ml-1 text-center md:text-start border'>
            <div className='flex flex-col h-full py-6'>
              <p className='text-xs md:text-base text-slate-300 md:mt-16'>
                Manage your characters
              </p>
              <h4 className='text-xl md:text-6xl mt-2 md:mt-4 text-slate-300 drop-shadow-[0_0_0.9rem_#000] dark:drop-shadow-[0_0_0.9rem_#000]'>
                The best way there is.
              </h4>

              <p className='text-xs md:text-base text-slate-300 text-justify  mt-2 md:my-6'>
                Whether you&apos;re a seasoned player or a newcomer finding your
                way, our intuitive interface and rich features will guide you
                every step of the way. Try our app today, and let your story
                unfold!
              </p>
              <div className='w-full md:w-56 mt-6'>
                <GlowUpButtonMedium
                  buttonText='Sign Up'
                  buttonHref='/dashboard'
                  buttonIcon={
                    <MdArrowOutward className='inline h-4 md:text-sm mb-1 ml-1' />
                  }
                />
              </div>
            </div>
          </div>
          <div className='flex flex-col col-span-6 lg:order-2 w-full h-full items-center justify-center shadow-md shadow-black'>
            <h1 className='text-8xl text-slate-300 text-center'>
              <Image
                src={'/iPadDark.png'}
                width={'1000'}
                height={'0'}
                alt='character image'
                className='xl:h-100% xl:w-100% border rounded-xl border-slate-300/50'
              />
            </h1>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className=' z-10 w-full text-slate-300/50 bg-clip-padding backdrop-filter backdrop-blur-lg bg-black bg-opacity-80 h-full md:h-full lg:h-56'>
        <div className='grid grid-cols-12 md:mx-2 md:h-68 border rounded-xl border-slate-300/50'>
          {/* COL 1 */}
          <div className='hidden md:flex flex-col col-span-3 items-start text-slate-300 px-4 py-2 m-2'>
            <p className='text-start text-sm'>Contact</p>

            <p className='text-justify text-xs mt-4'>
              <a href='https://krisnemeth.dev'>Developer: Krisztian Nemeth</a>
            </p>
            <p className='text-justify text-xs mt-2'>
              <a href='mailto:krsnmth@gmail.com'>Email: krsnmth@gmail.com</a>
            </p>
            <p className='text-justify text-xs mt-2 '>
              Portfolio:{' '}
              <a
                href='https://krisnemeth.dev'
                className='underline underline-offset-1'
              >
                {' '}
                krisnemeth.dev
              </a>
            </p>
            <p className='text-start text-xs mt-2'>
              Drop a message with your questions or feedback.
            </p>
          </div>
          {/* COL 2 */}
          <div className='hidden md:flex flex-col col-span-3 items-start text-slate-300 px-4 py-2 m-2'>
            <p className='text-start text-sm'>Social</p>
            <div className='flex flex-row text-start text-sm mt-4'>
              <a href='#'>
                <FaSquareXTwitter className='h-4' />
              </a>{' '}
              <p className='ml-1'>Twitter</p>
            </div>
            <div className='flex flex-row text-start text-sm mt-2'>
              <a href='#'>
                <FaSquareInstagram className='h-4' />
              </a>{' '}
              <p className='ml-1'>Instagram</p>
            </div>
            <div className='flex flex-row text-start text-sm mt-2'>
              <a href='#'>
                <FaSquareYoutube className='h-4' />
              </a>{' '}
              <p className='ml-1'>Youtube</p>
            </div>
            <div className='flex flex-row text-start text-sm mt-2'>
              <a href='#'>
                <AiFillTikTok className='h-4' />
              </a>{' '}
              <p className='ml-1'>TikTok</p>
            </div>
          </div>

          {/* COL 3 */}
          <div className='order-2 md:order-3 flex flex-col col-span-12 md:col-span-3 justify-end md:justify-start md:items-start px-2 md:px-4 md:py-2 m-2'>
            <p className='hidden md:block text-justify text-slate-300 text-sm'>
              Legal
            </p>
            <div className='md:hidden text-center'>
              <p className=' text-slate-300 text-xs'>
                All product and company names are trademarks&#8482; or
                registered&#174; trademarks of their respective holders.
              </p>
              <p className='text-slate-300 text-xs mt-2'>
                {currentYear} &copy; Elysium. All rights reserved.
              </p>
            </div>

            <p className='hidden md:block text-justify text-slate-300 text-xs mt-2'>
              <a href='https://www.paradoxinteractive.com/games/world-of-darkness/about'>
                Vampire: The Masquerade and associated logos, icons, and
                characters are the property of Paradox Interactive and White
                Wolf Entertainment. All rights reserved. Used with permission.
                For more information on Vampire: The Masquerade, please visit
                the official website Paradox Interactive.
              </a>
            </p>
          </div>
          {/* COL 4 */}
          <div className='hidden md:flex flex-col col-span-12 md:col-span-3 items-start border border-slate-300/50 rounded-md px-4 py-2 m-2 h-52 order-1 md:order-4'>
            <form action='#' className='mt-2 w-full'>
              <div className=''>
                <label
                  htmlFor='username'
                  className='block text-xs text-slate-300'
                >
                  Username
                </label>
                <input
                  type='text'
                  id='username'
                  className='text-xs text-slate-300 px-2 py-2 mt-0.5 border rounded-md w-full border-slate-300/50 bg-inherit shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent'
                />
              </div>
              <div className='mt-1 mb-5 '>
                <label
                  htmlFor='password'
                  className='block text-xs text-slate-300'
                >
                  Password
                </label>
                <input
                  type='text'
                  id='password'
                  className='text-xs text-slate-300 px-2 py-2 mt-0.5 border rounded-md w-full border-slate-300/50 bg-inherit shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent'
                />
              </div>
              <GlowUpButtonMedium
                buttonText='Sign Up'
                buttonHref='#'
                buttonIcon={
                  <MdArrowOutward className='inline h-4 md:text-sm mb-1 ml-1' />
                }
              />
            </form>
          </div>
          {/* <LogoGrid /> */}
        </div>
      </div>
    </>
  );
}
