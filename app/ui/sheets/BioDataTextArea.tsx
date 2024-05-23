import React from 'react';

interface TextAreaInputProps {
  label: string;
  id: string;
  rows: number;
}

export default function TextArea({ label, id, rows }: TextAreaInputProps) {
  return (
    <div className='xl:mx-4 mt-1 '>
      <div className='text-start my-1 mt-2'>
        <h4 className='text-base text-slate-300'>{label}</h4>
      </div>
      <div className='flex mb-2'>
        <textarea
          id='notes'
          rows={rows}
          className='w-full bg-inherit border-2 border-slate-300 border-dotted text-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none'
        ></textarea>
      </div>
    </div>
  );
}
