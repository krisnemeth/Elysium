import React from 'react';

interface BioDataDateOfProps {
  label: string;
  placeholder: string;
  id: string;
  value: string;
  onChange: (date: Date) => void;
}

export default function BioDataDateOf({
  label,
  placeholder,
  id,
  value,
  onChange,
}: BioDataDateOfProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(new Date(e.target.value));
  };

  return (
    <div className='grid grid-cols-12 mx-4 my-1'>
      <label htmlFor={id} className='text-base mt-2 text-slate-300 col-span-4'>
        {label}
      </label>
      <input
        type='date'
        id={id}
        className='bg-inherit border-b-2 border-dotted border-slate-300 text-slate-300 shadow-sm focus:outline-none col-span-8 cursor-text'
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}
