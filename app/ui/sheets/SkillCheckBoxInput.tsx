'use client';
import React from 'react';

interface SkillCheckBoxInputProps {
  label: string;
  values: boolean[];
  textValues: string[];
  onChange: (index: number) => void;
  onTextChange: (newValue: string) => void;
}

export default function SkillCheckBoxInput({
  label,
  values,
  textValues,
  onChange,
  onTextChange,
}: SkillCheckBoxInputProps) {
  return (
    <div className='grid grid-cols-12 mx-1 py-1  border-b-2 border-dotted border-slate-300'>
      <label htmlFor={label} className='mt-1 text-sm text-slate-300 col-span-3'>
        {label}
      </label>
      <div className='col-span-6'>
        {textValues.map((textValue, index) => (
          <input
            key={index}
            type='text'
            id={label}
            name={label}
            value={textValue}
            onChange={(e) => onTextChange(e.target.value)}
            className=' text-slate-500 bg-inherit shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent w-40 h-6 inline-block cursor-text'
          />
        ))}
      </div>
      <div className='flex justify-end mt-1 col-span-3'>
        {values.map((value, index) => (
          <>
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
          </>
        ))}
      </div>
    </div>
  );
}
