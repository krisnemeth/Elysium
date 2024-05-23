import React from 'react';

interface ExperienceInputProps {
  name: string;
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Experience({
  name,
  label,
  value,
  onChange,
}: ExperienceInputProps) {
  return (
    <div className='grid grid-cols-12 p-1 mx-2'>
      <div className='flex flex-col col-span-4'>
        <label
          htmlFor='experience'
          className='lg:text-lg xl:text-lg text-slate-300 mt-3'
        >
          {label}
        </label>
      </div>
      <div className='flex flex-col col-span-8'>
        <input
          type='text'
          id='name'
          name={name}
          value={value}
          onChange={onChange}
          className='mt-1 border-b-2 border-dotted w-full px-2 py-0.5 border-slate-300 text-slate-300 bg-inherit shadow-sm focus:outline-none'
        />
      </div>
    </div>
  );
}
