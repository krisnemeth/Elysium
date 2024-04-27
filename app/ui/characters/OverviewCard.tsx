import React from 'react';
import { Jslab } from '@/app/fonts';
import CharacterList from './CharacterList';
import Image from 'next/image';
import {
  BrujahLogo,
  VentrueLogo,
  MalkavianLogo,
  TremereLogo,
  GangrelLogo,
} from '@/app/ui/svgs';

interface OverviewCardProps {
  Amount: number;
  cardTitle: string;
}

export default function OverviewCard({ cardTitle, Amount }: OverviewCardProps) {
  return (
    <div className='w-full h-full border-2 border-black bg-black rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-60 '>
      <div className='h-16 border-2 border-black bg-black flex items-center justify-between p-2'>
        <p className='text-slate-300 text-xl '>{cardTitle}</p>
        <p className='text-slate-300 text-xl '>{Amount}</p>
      </div>
      <CharacterList
        characterImage={
          <Image
            src={'/Brujah.jpg'}
            width={'100'}
            height={'100'}
            alt='character image'
            className='rounded-full xl:h-10 xl:w-10'
          />
        }
        characterName='Jacques Sauvage'
        clanSymbol={<BrujahLogo className='text-slate-300 h-6' />}
      />
      <CharacterList
        characterImage={
          <Image
            src={'/Ventrue.jpg'}
            width={'100'}
            height={'100'}
            alt='character image'
            className='rounded-full xl:h-10 xl:w-10'
          />
        }
        characterName='Ailah Al-Malik'
        clanSymbol={<VentrueLogo className='text-slate-300 h-6' />}
      />
      <CharacterList
        characterImage={
          <Image
            src={'/Malkavian.jpg'}
            width={'100'}
            height={'100'}
            alt='character image'
            className='rounded-full xl:h-10 xl:w-10'
          />
        }
        characterName='Claire Voyant'
        clanSymbol={<MalkavianLogo className='text-slate-300 h-6' />}
      />
      <CharacterList
        characterImage={
          <Image
            src={'/Tremere.jpg'}
            width={'100'}
            height={'100'}
            alt='character image'
            className='rounded-full xl:h-10 xl:w-10'
          />
        }
        characterName='Agatha'
        clanSymbol={<TremereLogo className='text-slate-300 h-6' />}
      />
      <CharacterList
        characterImage={
          <Image
            src={'/Gangrel.jpg'}
            width={'100'}
            height={'100'}
            alt='character image'
            className='rounded-full xl:h-10 xl:w-10'
          />
        }
        characterName='Chelsea Grim'
        clanSymbol={<GangrelLogo className='text-slate-300 h-6' />}
      />
    </div>
  );
}
