'use client';
import React from 'react';

interface SkillCheckBoxInputProps {
  label: string;
  values: boolean[];
  onChange: (index: number) => void;
}

export default function SkillCheckBoxInput({
  label,
  values,
  onChange,
}: SkillCheckBoxInputProps) {
  return (
    <div className='grid grid-cols-2 mx-4 py-1  border-b-2 border-dotted border-slate-300'>
      <label htmlFor={label} className=' text-lg text-slate-300'>
        {label}
      </label>
      <div className='flex justify-end mt-1'>
        {values.map((value, index) => (
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
  );
}
