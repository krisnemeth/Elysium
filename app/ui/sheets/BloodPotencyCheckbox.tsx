import React from 'react';
interface BloodPotencyCheckboxProps {
  bloodPotency: boolean[];
  handleBloodPotencyChange: (
    index: number
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function BloodPotencyCheckbox({
  bloodPotency,
  handleBloodPotencyChange,
}: BloodPotencyCheckboxProps) {
  return (
    <div className='grid grid-cols-12 mx-4'>
      <label htmlFor='hunger' className=' text-lg text-slate-300 col-span-4'>
        Blood Potency
      </label>
      <div className='flex justify-end mt-1 col-span-8'>
        {bloodPotency.map((value, index) => (
          <>
            <input
              key={index}
              type='checkbox'
              checked={value}
              onChange={handleBloodPotencyChange(index)}
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
