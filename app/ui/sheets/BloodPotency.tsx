'use client';
import React, { useState } from 'react';

export default function BloodPotency() {
  const [bloodPotency, setBloodPotency] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  const handleHungerChange =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.checked;

      setBloodPotency((prevBloodPotency) =>
        prevBloodPotency.map((prevValue, i) =>
          i === index ? value : prevValue
        )
      );
    };

  return (
    <div className='grid grid-cols-12 '>
      <label htmlFor='hunger' className=' text-lg text-slate-300 col-span-4'>
        Blood Potency
      </label>
      <div className='flex justify-center mt-1 col-span-8'>
        {bloodPotency.map((value, index) => (
          <>
            <input
              key={index}
              type='checkbox'
              checked={value}
              onChange={handleHungerChange(index)}
              className={`border-2 border-slate-300 text-slate-300 shadow-sm rotate-45 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent rounded-md ml-3 w-4 h-4 inline-block cursor-pointer checked:bg-slate-300 ${
                value ? 'bg-slate-300' : ''
              }`}
            />
          </>
        ))}
      </div>
    </div>
  );
}
