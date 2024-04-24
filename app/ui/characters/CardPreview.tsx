import Image from 'next/image';
import { BrujahLogo } from '@/app/ui/svgs';
import { BrujahTitle } from '@/app/ui/svgs';

type CardPreviewProps = {
  characterImage: React.ReactNode;
  characterName: string;
  description: string;
  Title: React.ReactNode;
  Logo: React.ReactNode;
};

export default function CardPreview({
  characterImage,
  characterName,
  description,
  Logo,
  Title,
}: CardPreviewProps) {
  return (
    <div className='flex flex-col text-slate-300 border-2 border-black bg-black rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-60 shadow-2xl w-full h-full xl:h-72'>
      <div className='grid grid-cols-12'>
        <div className='flex flex-col col-span-4 xl:col-span-5 p-2  items-center'>
          {characterImage}

          <div className='flex'>
            <div>{Title}</div>
          </div>
        </div>
        <div className='flex flex-col col-span-8 xl:col-span-7'>
          <div className='flex items-center justify-between'>
            <h3 className='text-lg xl:text-2xl pt-5 px-4'>{characterName}</h3>
            <div className='px-4 mt-4'>{Logo}</div>
          </div>

          <p className='text-sm md:text-base text-justify pt-6 px-4 pb-6'>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
