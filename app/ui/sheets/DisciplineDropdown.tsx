import React from 'react';

interface TextInputDropdownProps {
  name: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export default function TextInputDropdown({
  name,
  options,
  value,
  onChange,
}: TextInputDropdownProps) {
  return (
    <div className=''>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='mt-2 border-none w-44 text-xl bg-inherit text-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-transparent rounded-md cursor-pointer'
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
