import React from 'react';
import { Elysium1, Elysium2, Elysium3, Elysium4, VtmAnkh } from '@/app/ui/svgs';
import { MdArrowDownward } from 'react-icons/md';
import GlowUpButtonLarge from '@/app/ui/glowUpButtonLarge';
import Link from 'next/link';

export default function WelcomeText() {
  return (
    <>
      <div className='flex flex-col items-center justify-center mt-2 lg:mx-80'>
        <div className=' text-slate-300 p-4'>
          <p className='text-xs text-center md:text-base lg:text-lg xl:text-xl px-16 translate-y-10 md:translate-y-16 xl:translate-y-16'>
            Welcome to
          </p>
          <div className='flex flex-row justify-center translate-y-5 md:translate-y-10 xl:translate-y-5'>
            <Elysium1 className=' text-slate-300 w-64 md:w-[350px] lg:w-[350px] xl:w-[450px] 2xl:w-[800px] drop-shadow-[0_0_0.9rem_#000]' />
          </div>

          <div className=' flex flex-row justify-center -translate-y-4 md:-translate-y-0 xl:-translate-y-10'>
            <VtmAnkh className='text-xl text-rose-600/70 dark:text-black w-80 md:w-[700px] lg:w-[500px] xl:w-[550px] 2xl:w-[800px] drop-shadow-[0_0_0.9rem_#e11d48] dark:drop-shadow-[0_0_0.9rem_#000]' />
          </div>
        </div>

        {/* <div className='mt-80 md:mt-[700px] lg:mt-6 p-4'>
          <Link href='#features'>
            <GlowUpButtonLarge
              buttonText='Learn More'
              buttonIcon={
                <MdArrowDownward className='text-slate-300 text-xl ml-2 mb-1' />
              }
            ></GlowUpButtonLarge>
          </Link>
        </div> */}
      </div>
    </>
  );
}
