import Image from 'next/image';
import { BrujahLogo } from '@/app/ui/svgs';
import { BrujahTitle } from '@/app/ui/svgs';
import React from 'react';
import GlowUpButtonMedium from '../glowUpButtonMedium';

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
    <div className='flex flex-col col-span-6 text-slate-300/80 border border-slate-300/50 bg-black rounded-2xl bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-80 shadow-md shadow-black w-full h-full xl:w-full'>
      <div className='grid grid-cols-1 xl:grid-cols-12 gap-1 m-2 xl:m-4'>
        <div className='flex flex-col max-w-full xl:col-span-4 p-2 items-center border border-slate-300/50 rounded-lg'>
          {characterImage}
        </div>
        <div className='flex flex-col xl:col-span-8 text-xs xl:text-base'>
          <div className='grid grid-cols-12 gap-0 mx-1 xl:mx-2 mt-2'>
            <div className='flex flex-col col-span-4 xl:col-span-6 pt-1 items-start justify-end'>
              <h3 className=''>Name:</h3>
            </div>
            <div className='flex flex-col col-span-8 xl:col-span-6 pt-1 items-end justify-end'>
              <h3 className=''>{characterName}</h3>
            </div>
          </div>
          <div className='grid grid-cols-12 gap-0 mx-1 xl:mx-2 mt-2'>
            <div className='flex flex-col col-span-4 xl:col-span-6 pt-1 items-start justify-end'>
              <h3 className=''>Clan:</h3>
            </div>
            <div className='flex flex-col col-span-8 xl:col-span-6 pt-1 items-end justify-end'>
              <h3 className=''>{clanTitle}</h3>
            </div>
          </div>
          <div className='grid grid-cols-12 gap-0 mx-1 xl:mx-2 mt-3'>
            <div className='flex flex-col col-span-6 pt-1 items-start justify-end'>
              <h3 className=''>Clan Symbol:</h3>
            </div>
            <div className='flex flex-col col-span-6 pt-1 items-end justify-end'>
              <h3 className=''>{clanLogo}</h3>
            </div>
          </div>
          <div className='flex flex-col col-span-2 mx-1 xl:mx-2 mt-3'>
            <p className='text-xs xl:text-sm text-justify'>{description}</p>
          </div>
        </div>
        <div className='flex flex-col col-span-1 xl:col-span-12 mt-2'>
          <div className='grid grid-cols-2 xl:grid-cols-12 gap-1'>
            <div className='flex flex-col col-span-1 xl:col-span-4'>
              <GlowUpButtonMedium buttonHref='#' buttonText='Loresheet' />
            </div>
            <div className='flex flex-col col-span-1 xl:col-span-4'>
              <GlowUpButtonMedium buttonHref='#' buttonText='Character Sheet' />
            </div>
            <div className='flex flex-col col-span-1 xl:col-span-4'>
              <GlowUpButtonMedium buttonHref='#' buttonText='Delete' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
