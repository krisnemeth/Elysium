import React from 'react';
import Image from 'next/image';
import { VscGithub } from 'react-icons/vsc';
import { SlSocialLinkedin } from 'react-icons/sl';
import {
  TremereLogo,
  VentrueLogo,
  MalkavianLogo,
  BrujahLogo,
  LasombraLogo,
  RavnosLogo,
  GangrelLogo,
  TzimisceLogo,
  NosferatuLogo,
  BanuHaqimLogo,
  ToreadorLogo,
  CamarillaTitle,
  AnarchTitle,
  VentrueTitle,
  TremereTitle,
  MalkavianTitle,
  BrujahTitle,
  LasombraTitle,
  RavnosTitle,
  GangrelTitle,
  TzimisceTitle,
  NosferatuTitle,
  BanuHaqimTitle,
  ToreadorTitle,
  HecataTitle,
} from '../svgs';
export default function HomePageArt() {
  return (
    <div className='absolute grid grid-cols-12 lg:gap-4 w-screen h-screen opacity-100 z-20'>
      <div className='flex flex-col items-center col-span-12 lg:col-span-12'>
        <div className='image-container-left fixed border'>
          <Image
            src={'/HomePageArtLeftMobile.webp'}
            alt=''
            height={0}
            width={600}
            priority={true}
            className='translate-x-0 translate-y-10 md:-translate-y-[50px] lg:translate-y-14 xl:translate-y-0 2xl:translate-x-[650px] 2xl:-translate-y-14 3xl:translate-x-[450px] 3xl:-translate-y-[170px] h-fit w-[400px] md:w-[850px] lg:w-[600px] xl:w-[700px] 2xl:w-[600px] 3xl:w-[1000px] '
          />
        </div>
      </div>
      {/* <div className='flex flex-col col-span-6 lg:col-span-4'>
        <div className='image-container-right flex'>
          <Image
            src={'/HomepageArtRight1.webp'}
            alt=''
            height={0}
            width={600}
            className='hidden translate-x-4 translate-y-80 md:-translate-x-56 md:translate-y-68 lg:translate-x-10 lg:translate-y-44 xl:translate-x-44 xl:translate-y-32 2xl:translate-x-40 2xl:translate-y-16 fixed h-fit lg:w-[600px] xl:w-[450px] 2xl:w-[600px]'
          />
        </div>
      </div> */}
      <div className='fixed bottom-0 z-80 w-full'>
        {/* container was next row class */}
        <div className='relative flex h-full mx-auto'>
          {/* left-side */}
          <div className='absolute bottom-0 hidden items-center mt-auto mr-auto text-rose-600/70 dark:text-slate-300/50 left-2 md:left-5 md:flex md:flex-col'>
            {/* <div className='w-6 h-6 mb-10 -translate-x-8 -rotate-90'>
              <AnarchTitle className='h-auto w-36 drop-shadow-[0_0_0.9rem_#e11d48] dark:drop-shadow-[0_0_0.9rem_#000]' />
            </div> */}
            <div className='w-6 h-6 mb-24 -translate-x-2 -rotate-90'>
              <GangrelTitle className='h-auto w-20 drop-shadow-[0_0_0.9rem_#e11d48] dark:drop-shadow-[0_0_0.9rem_#000]' />
            </div>
            <div className='w-6 h-6 mb-14 -translate-x-2 -rotate-90'>
              <MalkavianTitle className='h-auto w-24 drop-shadow-[0_0_0.9rem_#e11d48] dark:drop-shadow-[0_0_0.9rem_#000]' />
            </div>
            <div className='w-6 h-6 mb-24 -translate-x-2 -rotate-90'>
              <BrujahTitle className='h-auto w-16 drop-shadow-[0_0_0.9rem_#e11d48] dark:drop-shadow-[0_0_0.9rem_#000]' />
            </div>
            <div className='w-6 h-6 mb-28 -translate-x-1 -rotate-90'>
              <NosferatuTitle className='h-auto w-24 drop-shadow-[0_0_0.9rem_#e11d48] dark:drop-shadow-[0_0_0.9rem_#000]' />
            </div>
            <div className='w-6 h-6 mb-24 -translate-x-0 -rotate-90'>
              <VentrueTitle className='h-auto w-28 drop-shadow-[0_0_0.9rem_#e11d48] dark:drop-shadow-[0_0_0.9rem_#000]' />
            </div>
            <div className='w-6 h-6 mb-2 -translate-x-5 -rotate-90'>
              <ToreadorTitle className='h-auto w-24 drop-shadow-[0_0_0.9rem_#e11d48] dark:drop-shadow-[0_0_0.9rem_#000]' />
            </div>

            <div className='stick w-0.5 dark:bg-slate-300/50 bg-rose-600/70 drop-shadow-[0_0_0.3rem_#e11d48] dark:drop-shadow-[0_0_0.3rem_#000] md:h-96 lg:h-4 mt-2'></div>
          </div>

          {/* right-side */}
          <div className='absolute bottom-0 hidden items-center mt-auto ml-auto text-rose-600/70 dark:text-slate-300/50 right-2 md:right-6 md:flex md:flex-col'>
            <div className='w-6 h-6 mb-24 rotate-90 -translate-x-1'>
              <LasombraTitle className='h-auto w-24 drop-shadow-[0_0_0.9rem_#e11d48] dark:drop-shadow-[0_0_0.9rem_#000]' />
            </div>
            <div className='w-6 h-6 mb-20 rotate-90 -translate-x-1'>
              <RavnosTitle className='h-auto w-20 drop-shadow-[0_0_0.9rem_#e11d48] dark:drop-shadow-[0_0_0.9rem_#000]' />
            </div>
            <div className='w-6 h-6 mb-20 rotate-90 -translate-x-1'>
              <TzimisceTitle className='h-auto w-20 drop-shadow-[0_0_0.9rem_#e11d48] dark:drop-shadow-[0_0_0.9rem_#000]' />
            </div>
            <div className='w-6 h-6 mb-20 rotate-90 -translate-x-1'>
              <TremereTitle className='h-auto w-20 drop-shadow-[0_0_0.9rem_#e11d48] dark:drop-shadow-[0_0_0.9rem_#000]' />
            </div>
            <div className='w-6 h-6 mb-20 rotate-90 -translate-x-1'>
              <HecataTitle className='h-auto w-20 drop-shadow-[0_0_0.9rem_#e11d48] dark:drop-shadow-[0_0_0.9rem_#000]' />
            </div>
            <div className='w-6 h-6 mb-28 rotate-90'>
              <BanuHaqimTitle className='h-auto w-28 drop-shadow-[0_0_0.9rem_#e11d48] dark:drop-shadow-[0_0_0.9rem_#000]' />
            </div>
            <div className='stick w-0.5 dark:bg-slate-300/50 bg-rose-600/70 md:h-96 lg:h-4 mt-2 drop-shadow-[0_0_0.3rem_#e11d48] dark:drop-shadow-[0_0_0.3rem_#000]'></div>
          </div>
        </div>
      </div>
    </div>
  );
}
