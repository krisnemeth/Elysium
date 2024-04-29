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
    <div className='w-full h-full border-2 border-black bg-black rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-60 '>
      <div className='h-16 border-2 border-black bg-black flex items-center justify-between p-2'>
        <p className='text-slate-300 text-xl '>{cardTitle}</p>
        <p className='text-slate-300 text-xl '>{Amount}</p>
      </div>
      {children}
    </div>
  );
}
