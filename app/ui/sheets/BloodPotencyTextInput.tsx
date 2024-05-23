import React from 'react';

interface BloodPotencyTextInputProps {
  name: string;
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function BloodPotencyTextInput({
  name,
  label,
  value,
  onChange,
}: BloodPotencyTextInputProps) {
  return (
    <div className='p-1'>
      <label htmlFor='name' className='block text-sm text-slate-300'>
        {label}
      </label>
      <input
        type='text'
        id='name'
        name={name}
        value={value}
        onChange={onChange}
        className='mt-1 border-b-2 w-full px-2 py-1 border-slate-300 text-slate-300 bg-inherit shadow-sm focus:outline-none'
      />
    </div>
  );
}
