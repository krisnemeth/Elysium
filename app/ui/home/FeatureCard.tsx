import React from 'react';

interface FeatureCardProps {
  image?: React.ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({
  image,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className='flex flex-col col-span-3 border border-slate-300 text-slate-300 rounded-md w-full lg:w-80 xl:w-80'>
      <div className='card p-4 shadow-2xl'>
        <div className='h-44 border border-slate-300 rounded-md px-2 xl:px-4'>
          <h4 className='text-xl lg:text-3xl text-center'>VIDEO CONTENT</h4>
        </div>
        <div className='mt-4 px-2 xl:px-4'>
          <h3 className='text-base lg:text-xl font-bold'>{title}</h3>
        </div>
        <div className='mt-4 px-2 xl:px-4'>
          <p className='text-xs lg:text-lg text-justify'>{description}</p>
        </div>
      </div>
    </div>
  );
}
