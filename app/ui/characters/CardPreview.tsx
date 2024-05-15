import Image from 'next/image';
import { BrujahLogo } from '@/app/ui/svgs';
import { BrujahTitle } from '@/app/ui/svgs';
import React from 'react';

type CardPreviewProps = {
  characterImage: React.ReactNode;
  characterName: string;
  description: string;
  clanLogo: React.ReactNode;
  clanTitle: React.ReactNode;
};

export default function CardPreview({
  characterImage,
  characterName,
  description,
  clanLogo,
  clanTitle,
}: CardPreviewProps) {
  return (
    <div className='flex flex-col text-slate-300 border-2 border-slate-300 bg-black rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-60 shadow-2xl w-full h-full xl:h-44 xl:w-2/3 m-4'>
      <div className='grid grid-cols-12'>
        <div className='flex flex-col col-span-4 xl:col-span-4 p-2 items-center'>
          {characterImage}

          <div className='flex'>
            <div></div>
          </div>
        </div>
        <div className='flex flex-col col-span-8 xl:col-span-8'>
          <h3 className='text-base xl:text-xl pt-3 px-4'>{characterName}</h3>
          <div className='flex items-center justify-between'>
            <div className='px-4 mt-4'>{clanTitle}</div>
            <div className='px-4 mt-4'>{clanLogo}</div>
          </div>

          <p className='text-xs md:text-base text-justify pt-3 px-4 pb-6'>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
