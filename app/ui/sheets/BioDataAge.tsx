import React from 'react';

interface BioDataAgeProps {
  label: string;
  id: string;
  age: number;
}

export default function BioDataAge({ label, id, age }: BioDataAgeProps) {
  return (
    <div className='grid grid-cols-12 mx-4 my-1'>
      <label htmlFor={id} className='text-base mt-2 text-slate-300 col-span-4'>
        {label}
      </label>
      <div className='text-base text-slate-300 col-span-8 border-b-2 border-dotted border-slate-300'>
        {age}
      </div>
    </div>
  );
}
