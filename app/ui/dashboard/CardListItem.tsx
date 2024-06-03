import React from 'react';

interface ListItemProps {
  characterImage: React.ReactNode;
  characterName: string;
  clanSymbol: React.ReactNode;
}

export default function CardListItem({
  characterImage,
  characterName,
  clanSymbol,
}: ListItemProps) {
  return (
    <a href='#' className='cursor-pointer'>
      <div className='flex items-start justify-between text-slate-300 px-2 bg-black border border-slate-300/50 rounded-lg py-2 mx-2 my-2 hover:-translate-y-0.5 hover:shadow-md hover:shadow-rose-600 hover:border-rose-600 ease-in-out duration-200'>
        <div className='flex justify-start'>
          <div className='mr-4'>{characterImage}</div>
          <div className='flex flex-col justify-center text-base'>
            {characterName}
          </div>
        </div>

        <div className='w-8 p-2 mt-2'>
          <div>{clanSymbol}</div>
        </div>
      </div>
    </a>
  );
}
