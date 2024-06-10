import React from 'react';
import Image from 'next/image';

export default function HomePageArt() {
  return (
    <div className='absolute grid grid-cols-12 lg:gap-4 w-screen h-screen opacity-100 z-20'>
      <div className='flex flex-col col-span-6 lg:col-span-12'>
        <div className='image-container-left flex '>
          <Image
            src={'/HomePageArtLeftMobile.webp'}
            alt=''
            height={0}
            width={600}
            priority={true}
            className='translate-x-0 translate-y-10 md:translate-x-0 md:-translate-y-[50px] lg:translate-x-72 lg:translate-y-0 xl:translate-x-[370px] xl:-translate-y-10 2xl:translate-x-[650px] 2xl:-translate-y-14 3xl:translate-x-[780px] fixed h-fit w-[400px] md:w-[850px] lg:w-[600px] xl:w-[700px] 2xl:w-[600px] 3xl:w-[1000px]'
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
    </div>
  );
}
