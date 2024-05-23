import React from 'react';

interface TextAreaInputProps {
  label: string;
  id: string;
  rows: number;
}

export default function TextArea({ label, id, rows }: TextAreaInputProps) {
  return (
    <div className='mt-4'>
      <div className='text-center my-2 border-b-2 border-slate-300 mr-2 mt-4'>
        <h4 className='text-lg text-slate-300'>{label}</h4>
      </div>
      <div className='flex mx-4 ml-2 mb-2'>
        <textarea
          id='notes'
          rows={rows}
          className='w-full bg-inherit border-2 border-slate-300 border-dotted text-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none'
        ></textarea>
      </div>
    </div>
  );
}
