'use client';
import React, { useState } from 'react';

interface ResonanceHungerProps {
  label: string;
  hungerValues: boolean[];
  onChange: (index: number) => void;
}

export default function ResonanceHunger({
  label = 'Hunger',
  hungerValues = [false, false, false, false, false],
  onChange,
}: ResonanceHungerProps) {
  const [resonance, setResonance] = useState('');
  const [hunger, setHunger] = useState(hungerValues);

  return (
    <div className='grid grid-cols-2 gap-6 px-6 border-t-2 border-slate-300 mx-6 mt-6 mb-10'>
      <div className='flex flex-col  text-slate-300 px-10 mt-6'>
        <div className='grid grid-cols-12'>
          <label htmlFor='resonance' className='col-span-3 text-xl mt-2'>
            Resonance
          </label>
          <input
            id='resonance'
            type='text'
            className='mt-1 border-b-2 border-dotted w-80 px-2 py- border-slate-300 text-black bg-inherit shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent col-span-9'
          />
        </div>
      </div>
      <div className='flex flex-col'>
        <div className='grid grid-cols-12 mt-8 mx-20'>
          <label htmlFor={label} className=' text-lg text-slate-300 col-span-3'>
            {label}
          </label>
          <div className='flex justify-center mt-1 col-span-9'>
            {hungerValues.map((value, index) => (
              <>
                <input
                  key={index}
                  type='checkbox'
                  id={`${label}-${index}`}
                  name={`${label}-${index}`}
                  checked={value}
                  onChange={() => onChange(index)}
                  className={`border-2 border-slate-300 text-slate-300 shadow-sm rotate-45 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent rounded-md ml-3 w-4 h-4 inline-block cursor-pointer checked:bg-slate-300 ${
                    value ? 'bg-slate-300' : ''
                  }`}
                />
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
