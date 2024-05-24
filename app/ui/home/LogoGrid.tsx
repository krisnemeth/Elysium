import React from 'react';
import {
  BrujahLogo,
  VentrueLogo,
  MalkavianLogo,
  TremereLogo,
  BanuHaqimLogo,
  HecataLogo,
  GangrelLogo,
  NosferatuLogo,
  ToreadorLogo,
  LasombraLogo,
  RavnosLogo,
  TzimisceLogo,
} from '../svgs';

export default function LogoGrid() {
  return (
    <div className='flex flex-col col-span-12 items-center justify-end'>
      <div className='grid grid-cols-12 w-full mb-2'>
        <div className='flex flex-col col-span-1 items-center'>
          <BrujahLogo className='text-slate-300/50 h-6 w-6' />
        </div>
        <div className='flex flex-col col-span-1 items-center'>
          <ToreadorLogo className='text-slate-300/50 h-6 w-6' />
        </div>
        <div className='flex flex-col col-span-1 items-center'>
          <NosferatuLogo className='text-slate-300/50 h-6 w-6' />
        </div>
        <div className='flex flex-col col-span-1 items-center'>
          <VentrueLogo className='text-slate-300/50 h-6 w-6' />
        </div>
        <div className='flex flex-col col-span-1 items-center'>
          <GangrelLogo className='text-slate-300/50 h-6 w-6' />
        </div>
        <div className='flex flex-col col-span-1 items-center'>
          <TremereLogo className='text-slate-300/50 h-6 w-6' />
        </div>
        <div className='flex flex-col col-span-1 items-center'>
          <MalkavianLogo className='text-slate-300/50 h-6 w-6' />
        </div>
        <div className='flex flex-col col-span-1 items-center'>
          <LasombraLogo className='text-slate-300/50 h-6 w-6' />
        </div>
        <div className='flex flex-col col-span-1 items-center'>
          <TzimisceLogo className='text-slate-300/50 h-6 w-6' />
        </div>
        <div className='flex flex-col col-span-1 items-center'>
          <BanuHaqimLogo className='text-slate-300/50 h-6 w-6' />
        </div>
        <div className='flex flex-col col-span-1 items-center'>
          <RavnosLogo className='text-slate-300/50 h-6 w-6' />
        </div>
        <div className='flex flex-col col-span-1 items-center'>
          <HecataLogo className='text-slate-300/50 h-6 w-6' />
        </div>
      </div>
    </div>
  );
}
