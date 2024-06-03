import React from 'react';
import { Jslab } from '@/app/fonts';
import CardList from './CardList';
import Image from 'next/image';

interface OverviewCardProps {
  Amount: number;
  cardTitle: string;
  children?: React.ReactNode;
}

export default function OverviewCard({
  cardTitle,
  Amount,
  children,
}: OverviewCardProps) {
  return (
    <div className='w-full border border-slate-300/50 bg-black bg-opacity-80 rounded-xl bg-clip-padding backdrop-filter backdrop-blur-lg shadow-md shadow-black p-2'>
      <div className='h-16 bg-black border border-slate-300/50 rounded-md flex items-center justify-between py-2 px-4'>
        <p className='text-slate-300 text-base '>{cardTitle}</p>
        <p className='text-slate-300 text-base '>{Amount}</p>
      </div>
      {children}
    </div>
  );
}
