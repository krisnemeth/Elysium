import React from 'react';

interface LifeStatsInputProps {
  label: string;
  values: boolean[];
  onChange: (index: number) => void;
}

export default function LifeStatsInput({
  label,
  values,
  onChange,
}: LifeStatsInputProps) {
  return (
    <div className='text-center my-4'>
      <label htmlFor={label} className='text-sm text-slate-300'>
        {label}
      </label>
      <div className='flex justify-center my-2'>
        {values.map((value, index) => (
          <input
            key={index}
            type='checkbox'
            id={`${label}-${index}`}
            name={`${label}-${index}`}
            checked={value}
            onChange={() => onChange(index)}
            className={`rotate-45 border-2 border-slate-300 text-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent rounded-md ml-2 md:ml-1.5 w-3 h-3 inline-block cursor-pointer checked:bg-slate-300 ${
              value ? 'bg-slate-300' : ''
            }`}
          />
        ))}
      </div>
    </div>
  );
}
