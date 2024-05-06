import React from 'react';
import { VtmAnkh } from '../svgs';

interface CategoryDividersProps {
  title: string;
}

export default function CategoryDividers({ title }: CategoryDividersProps) {
  return (
    <div className='flex justify-center border-b-2 border-slate-300 mx-8'>
      <VtmAnkh className='h-4 text-slate-300 rotate-90 mr-4 mt-4' />
      <h2 className='text-slate-300 text-xl text-center py-3'>{title}</h2>
      <VtmAnkh className='h-4 text-slate-300 -rotate-90 ml-4 mt-4' />
    </div>
  );
}
