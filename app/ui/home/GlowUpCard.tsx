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
    <div className='flex flex-col col-span-1 md:col-span-6 lg:col-span-6 xl:col-span-6 w-full h-full bg-black border border-slate-300/50 rounded-xl hover:-translate-y-0.5 hover:shadow-md hover:shadow-rose-600 hover:border-rose-600 hover:dark:border-red-700 hover:dark:shadow-red-700 ease-in-out duration-200 p-2 cursor-pointer'>
      <div className='card p-2 text-slate-300'>
        <div className='p-0'>{image}</div>
        <div className='mt-4'>
          <h3 className='text-sm lg:text-base font-bold'>{title}</h3>
        </div>
        <div className='mt-4 h-auto'>
          <p className='text-xs lg:text-base text-justify'>{description}</p>
        </div>
      </div>
    </div>
  );
}
