'use client';
import React, { useState } from 'react';

export default function ResonanceHunger() {
  const [resonance, setResonance] = useState('');
  const [hunger, setHunger] = useState([false, false, false, false, false]);

  const handleResonanceChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setResonance(event.target.value);
  };

  const handleHungerChange =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.checked;

      setHunger((prevHunger) =>
        prevHunger.map((prevValue, i) => (i === index ? value : prevValue))
      );
    };

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-2 px-2 lg:px-6 mx-2 xl:mx-6 mt-6 mb-10'>
      <div className='flex flex-col text-slate-300 xl:px-10 mt-6'>
        <div className='grid grid-cols-1 xl:grid-cols-12 '>
          <label
            htmlFor='resonance'
            className='col-span-6 xl:col-span-3 text-base text-center xl:text-start mt-2'
          >
            Resonance
          </label>
          <input
            id='resonance'
            type='text'
            value={resonance}
            onChange={handleResonanceChange}
            className='mt-1 border-b-2 border-dotted  xl:w-80 px-2 py-0 border-slate-300 text-lg text-slate-300 bg-inherit shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent col-span-6 xl:col-span-9'
          />
        </div>
      </div>
      <div className='flex flex-col'>
        <div className='grid grid-cols-1 xl:grid-cols-12 md:mt-8 xl:mt-8 mx-20'>
          <label
            htmlFor='hunger'
            className=' text-base text-center text-slate-300 col-span-3'
          >
            Hunger
          </label>
          <div className='flex justify-center mt-1 mb-2 col-span-9'>
            {hunger.map((value, index) => (
              <>
                <input
                  key={index}
                  type='checkbox'
                  checked={value}
                  onChange={handleHungerChange(index)}
                  className={`border-2 border-slate-300 text-slate-300 shadow-sm rotate-45 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent rounded-md ml-2 w-3 h-3 inline-block cursor-pointer checked:bg-slate-300 ${
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
