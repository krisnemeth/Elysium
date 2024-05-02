import React from 'react';

interface CategoryDividersProps {
  title: string;
}

export default function CategoryDividers({ title }: CategoryDividersProps) {
  return (
    <div className='border-b-2 border-slate-300 mx-8'>
      <h2 className='text-slate-300 text-xl text-center py-3'>{title}</h2>
    </div>
  );
}
