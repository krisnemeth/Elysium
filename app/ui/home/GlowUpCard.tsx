import React from 'react';

interface GlowUpCardProps {
  image?: React.ReactNode;
  title: string;
  description: string;
}

export default function GlowUpButtonLarge({
  image,
  title,
  description,
}: GlowUpCardProps) {
  return (
    <div className='flex flex-col col-span-3 w-full h-full bg-black border border-slate-300/50 rounded-xl p-2'>
      <div className='card p-2 text-slate-300'>
        <div className='h-52 border border-slate-300/50 rounded-md px-2 xl:px-4 mt-0'>
          <h4 className='text-xl lg:text-3xl text-center'>VIDEO CONTENT</h4>
        </div>
        <div className='mt-4'>
          <h3 className='text-sm lg:text-base font-bold'>{title}</h3>
        </div>
        <div className='mt-4 h-40'>
          <p className='text-xs lg:text-base text-justify'>{description}</p>
        </div>
      </div>
    </div>
  );
}
