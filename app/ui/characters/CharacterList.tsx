import React from 'react';

interface CharacterListProps {
  characterImage: React.ReactNode;
  characterName: string;
  clanSymbol: React.ReactNode;
}

export default function CharacterList({
  characterImage,
  characterName,
  clanSymbol,
}: CharacterListProps) {
  return (
    <div>
      {/* hardcoding characters just now for rep purpose, will map through them later once they are in db */}
      <div className='flex items-start justify-between text-slate-300 px-2 border-b border-black py-2'>
        <div className='flex justify-start'>
          <div className='mr-4'>{characterImage}</div>
          <div className='mt-2 text-xl'>{characterName}</div>
        </div>

        <div className='w-10 p-2'>
          <div>{clanSymbol}</div>
        </div>
      </div>
    </div>
  );
}
