import React from 'react';
import { VtmAnkh } from '@/app/ui/svgs';
import { MdArrowDownward } from 'react-icons/md';
import GlowUpButtonLarge from '@/app/ui/glowUpButtonLarge';
import Link from 'next/link';

export default function WelcomeText() {
  return (
    <>
      <div className=' flex flex-col items-center justify-center mt-2 md:mt-20 lg:mt-24 lg:mx-80 '>
        <div className='pt-8 lg:pt-0 pb-2 md:py-10 text-slate-300 p-4 '>
          <p className='text-xs text-center md:text-base lg:text-lg xl:text-xl mt-6 lg:mt-0 px-16'>
            Welcome to
          </p>
          <h1 className='text-6xl lg:text-7xl xl:text-8xl text-center tracking-wide bg-gradient-to-r from-violet drop-shadow-[0_0_0.9rem_#000] dark:drop-shadow-[0_0_0.9rem_#000]'>
            Elysium
          </h1>
          {/* <p className='text-xs text-justify md:text-base lg:text-base xl:text-xl mt-1 md:px-0 px-2'>
            Are you ready to immerse yourself in the dark and mysterious world
            of Vampire: The Masquerade? Look no further than Elysium, your
            indispensable character management tool designed to elevate your
            gaming experience.
          </p> */}
          <div className='flex flex-row justify-center mt-1'>
            <VtmAnkh className='text-xl text-rose-600/70 dark:text-black w-80 md:w-[700px] lg:w-[500px] xl:w-[550px] 2xl:w-[800px] drop-shadow-[0_0_0.9rem_#e11d48] dark:drop-shadow-[0_0_0.9rem_#000]' />
          </div>
        </div>

        <div className='mt-80 md:mt-[700px] lg:mt-6 p-4'>
          <Link href='#features'>
            <GlowUpButtonLarge
              buttonText='Learn More'
              buttonIcon={
                <MdArrowDownward className='text-slate-300 text-xl ml-2 mb-1' />
              }
            ></GlowUpButtonLarge>
          </Link>
        </div>
      </div>
    </>
  );
}
