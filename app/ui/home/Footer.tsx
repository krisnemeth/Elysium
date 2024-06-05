import React from 'react';
import GlowUpButtonMedium from '../glowUpButtonMedium';
import {
  FaSquareXTwitter,
  FaSquareInstagram,
  FaSquareYoutube,
} from 'react-icons/fa6';
import { AiFillTikTok } from 'react-icons/ai';

import { MdArrowOutward } from 'react-icons/md';

import LogoGrid from './LogoGrid';

export default function Footer() {
  return (
    <div className='absolute bottom-0 z-10 w-full text-slate-300/50 bg-clip-padding backdrop-filter backdrop-blur-lg bg-black bg-opacity-50 py-3'>
      <div className='grid grid-cols-12 md:mx-2 h-56 border rounded-xl border-slate-300/50'>
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
        <div className='hidden md:flex flex-col col-span-3 items-start px-4 py-2 m-2'>
          <p className='text-justify text-slate-300 text-sm'>Legal</p>
          {/* <p className='text-justify text-slate-300 text-xs mt-4'>
        All product and company names are trademarks&#8482; or
        registered&#174; trademarks of their respective holders.
      </p> */}
          <p className='text-justify text-slate-300 text-xs mt-2'>
            <a href='https://www.paradoxinteractive.com/games/world-of-darkness/about'>
              Vampire: The Masquerade and associated logos, icons, and
              characters are the property of Paradox Interactive and White Wolf
              Entertainment. All rights reserved. Used with permission. For more
              information on Vampire: The Masquerade, please visit the official
              website Paradox Interactive.
            </a>
          </p>
        </div>
        {/* COL 4 */}
        <div className='flex flex-col col-span-12 md:col-span-3 items-start border border-slate-300/50 rounded-md px-4 py-2 m-2'>
          <p className='text-start text-slate-300 text-sm'>Sign Up</p>
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
                id='name'
                className='text-xs text-slate-300 px-2 py-1 mt-0.5 border rounded-md w-full border-slate-300/50 bg-inherit shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent'
              />
            </div>
            <div className='mt-2'>
              <label
                htmlFor='password'
                className='block text-xs text-slate-300'
              >
                Password
              </label>
              <input
                type='text'
                id='name'
                className='text-xs text-slate-300 px-2 py-1 mt-0.5 border rounded-md w-full border-slate-300/50 bg-inherit shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent'
              />
            </div>
            <GlowUpButtonMedium
              buttonText='Sign Up'
              buttonHref='#'
              buttonIcon={
                <MdArrowOutward className='inline text-xs md:text-sm mb-1' />
              }
            />
          </form>
        </div>
        <LogoGrid />
      </div>
    </div>
  );
}
