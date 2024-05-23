import React from 'react';

export default function TenetsTouchstonesBane() {
  return (
    <div className='grid grid-cols-1 xl:grid-cols-3 mx-2 xl:mx-6 my-6'>
      <div className='flex flex-col xl:border-r-2 border-slate-300'>
        <div className='border-b-2 border-slate-300'>
          <h4 className='text-center text-lg text-slate-300'>
            Chronicle Tenets
          </h4>
        </div>
        <textarea
          id='tenets'
          rows={8}
          className='bg-inherit border-2 border-slate-300 border-dotted text-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent m-2 resize-none'
        ></textarea>
      </div>
      <div className='flex flex-col xl:border-r-2 border-slate-300'>
        <div className='border-b-2 border-slate-300'>
          <h4 className='text-center text-lg text-slate-300'>
            Touchstones & Convictions
          </h4>
        </div>
        <textarea
          id='tenets'
          rows={8}
          className='bg-inherit border-2 border-slate-300 border-dotted text-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent m-2 resize-none'
        ></textarea>
      </div>
      <div className='flex flex-col'>
        <div className='border-b-2 border-slate-300'>
          <h4 className='text-center text-lg text-slate-300'>Clan Bane</h4>
        </div>
        <textarea
          id='tenets'
          rows={8}
          className='bg-inherit border-2 border-slate-300 border-dotted text-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent m-2 resize-none'
        ></textarea>
      </div>
    </div>
  );
}
