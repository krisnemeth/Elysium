import React from 'react';

export default function Notes() {
  return (
    <>
      <div className='text-center my-2 border-b-2 border-slate-300 mr-2 mt-4'>
        <h4 className='text-lg text-slate-300'>Notes</h4>
      </div>
      <div className='flex mr-2 mb-6'>
        <textarea
          id='notes'
          rows={10}
          className='w-full bg-inherit border-2 border-slate-300 border-dotted text-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent'
        ></textarea>
      </div>
    </>
  );
}
