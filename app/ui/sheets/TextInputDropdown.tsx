import React from 'react';

interface TextInputDropdownProps {
  name: string;
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export default function TextInputDropdown({
  name,
  label,
  options,
  value,
  onChange,
}: TextInputDropdownProps) {
  return (
    <div className='p-2'>
      <label htmlFor={label} className='block text-sm text-slate-300'>
        {label}
      </label>
      <select
        id={label}
        name={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='mt-1 border rounded-md w-full p-2 border-slate-300/80 text-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-600 focus:dark:ring-slate-300 focus:border-transparent bg-inherit'
      >
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
