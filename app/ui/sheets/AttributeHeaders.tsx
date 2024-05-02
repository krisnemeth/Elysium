import React from 'react';

export default function AttributeHeaders() {
  return (
    <div className='grid grid-cols-3 gap-0 px-6'>
      <div className='flex flex-col text-center mt-2'>
        <h3 className='text-base text-slate-300'>Physical</h3>
      </div>
      <div className='flex flex-col text-center mt-2'>
        <h3 className='text-base text-slate-300'>Social</h3>
      </div>
      <div className='flex flex-col text-center mt-2'>
        <h3 className='text-base text-slate-300'>Mental</h3>
      </div>
    </div>
  );
}
