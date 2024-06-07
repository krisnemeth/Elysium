import React from 'react';
import { VtmAnkh } from '@/app/ui/svgs';
import { MdArrowDownward } from 'react-icons/md';
import GlowUpButtonLarge from '@/app/ui/glowUpButtonLarge';

export default function WelcomeText() {
  return (
    <>
      <div className=' flex flex-col items-center justify-center mt-2 md:mt-20 lg:mt-48 lg:mx-80 '>
        <div className='pt-8 pb-2 md:py-10 text-slate-300 p-4 '>
          <p className='text-xs text-center md:text-base lg:text-lg xl:text-xl mt-6 px-16'>
            Welcome to
          </p>
          <h1 className='text-5xl md:text-6xl lg:text-7xl xl:text-8xl drop-shadow-xl text-center tracking-wide bg-gradient-to-r from-violet '>
            Elysium
          </h1>
          <p className='text-xs text-justify md:text-base lg:text-base xl:text-xl mt-1 md:px-0 px-16'>
            Are you ready to immerse yourself in the dark and mysterious world
            of Vampire: The Masquerade? Look no further than Elysium, your
            indispensable character management tool designed to elevate your
            gaming experience.
          </p>
          <div className='flex md:hidden flex-row justify-center mt-10'>
            <VtmAnkh className='text-xl text-slate-300 w-20' />
          </div>
        </div>

        <div className='mt-80 md:mt-[700px] lg:mt-6 p-4'>
          <a href='#features'>
            <GlowUpButtonLarge
              buttonText='Learn More'
              buttonIcon={
                <MdArrowDownward className='text-slate-300 text-xl ml-2 mb-1' />
              }
            ></GlowUpButtonLarge>
          </a>
        </div>
      </div>
    </>
  );
}
