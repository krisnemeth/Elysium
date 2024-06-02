'use client';
import React from 'react';

interface CheckBoxInputProps {
  label: string;
  values: boolean[];
  onChange: (index: number) => void;
}

export default function CheckBoxInput({
  label,
  values,
  onChange,
}: CheckBoxInputProps) {
  return (
    <div className='grid grid-cols-2 px-2 py-2'>
      <label htmlFor={label} className='text-xs xl:text-sm text-slate-300'>
        {label}
      </label>
      <div className='flex justify-end mt-1'>
        {values.map((value, index) => (
          <div key={index}>
            <input
              key={index}
              type='checkbox'
              id={`${label}-${index}`}
              name={`${label}-${index}`}
              checked={value}
              onChange={() => onChange(index)}
              className={`border-2 border-slate-300 text-slate-300 shadow-sm rotate-45 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent rounded-md ml-2 w-3 h-3 inline-block cursor-pointer checked:bg-slate-300 ${
                value ? 'bg-slate-300' : ''
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
