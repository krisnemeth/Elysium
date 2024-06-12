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
    <div className='flex flex-col col-span-1 md:col-span-6 lg:col-span-3 w-full h-full bg-black border border-slate-300/50 rounded-xl p-2'>
      <div className='card p-2 text-slate-300'>
        <div className='mt-0'>{image}</div>
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
