import React from 'react';

interface TextInputProps {
  name: string;
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function TextInput({
  name,
  label,
  value,
  onChange,
}: TextInputProps) {
  return (
    <div className=' p-2'>
      <label htmlFor='name' className='block text-sm text-slate-300'>
        {label}
      </label>
      <input
        type='text'
        id='name'
        name={name}
        value={value}
        onChange={onChange}
        className='mt-1 border-2 w-full px-2 py-1 border-slate-300 text-black bg-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent rounded-md'
      />
    </div>
  );
}
