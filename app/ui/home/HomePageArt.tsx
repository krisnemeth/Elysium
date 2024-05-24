import React from 'react';
import Image from 'next/image';

export default function HomePageArt() {
  return (
    <div className='absolute grid grid-cols-12 lg:gap-4 w-screen h-screen opacity-100 z-20'>
      <div className='flex flex-col col-span-6 lg:col-span-4'>
        <div className=' image-container-left flex '>
          <Image
            src={'/HomepageArtLeft.webp'}
            alt=''
            height={0}
            width={600}
            className='-translate-x-20 translate-y-52 md:-translate-x-6 md:translate-y-[500px] lg:-translate-x-28 lg:translate-y-28 xl:-translate-x-28 xl:translate-y-28 2xl:-translate-x-40 2xl:translate-y-16 fixed h-fit w-[400px] md:w-[400px] lg:w-[400px] xl:w-[400px] 2xl:w-[600px]'
          />
        </div>
      </div>
      <div className='hidden lg:flex flex-col col-span-4 items-center justify-center  lg:col-span-4 '></div>
      <div className='flex flex-col col-span-6 lg:col-span-4'>
        <div className='image-container-right flex'>
          <Image
            src={'/HomepageArtRight.webp'}
            alt=''
            height={0}
            width={600}
            className='translate-x-4 translate-y-80 md:-translate-x-56 md:translate-y-68 lg:translate-x-24 lg:translate-y-44 xl:translate-x-44 xl:translate-y-32 2xl:translate-x-40 2xl:translate-y-16 fixed h-fit w-[250px] md:w-[700px] lg:w-[400px] xl:w-[450px] 2xl:w-[600px]'
          />
        </div>
      </div>
    </div>
  );
}
