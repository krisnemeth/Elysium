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
    <div className='relative group flex flex-col col-span-4'>
      <div className='absolute -inset-y-0.5 bg-gradient-to-b from-violet-600 to-violet-950 dark:from-zinc-700 dark:to-neutral-500 rounded-lg blur-sm opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 w-full h-full xl:w-96'></div>

      <div className='relative flex flex-col items-center justify-center bg-black px-4 py-2 text-slate-300 rounded-lg group-hover:text-slate-100 transition duration-200 ease-in-out w-full h-full xl:w-96'>
        <div className='card p-1 shadow-2xl'>
          <div className='h-40 border border-slate-300/50 rounded-md px-2 xl:px-4 mt-2'>
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
    </div>
  );
}
