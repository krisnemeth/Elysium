import React from 'react';

interface FeatureColumnProps {
  image?: React.ReactNode;
  title: string;
  description: string;
}

export default function FeatureColumn({
  image,
  title,
  description,
}: FeatureColumnProps) {
  return (
    <div className='flex flex-col col-span-3 border-2 border-slate-300 text-slate-300 w-80'>
      <div className='card p-4'>
        <div className='h-56 border-2 border-slate-300'>
          <h4 className='text-xl lg:text-4xl text-center'>IMAGE</h4>
        </div>
        <div className='mt-4'>
          <h3 className='text-base lg:text-xl'>{title}</h3>
        </div>
        <div className='mt-4'>
          <p className='text-xs lg:text-lg '>{description}</p>
        </div>
      </div>
    </div>
  );
}
