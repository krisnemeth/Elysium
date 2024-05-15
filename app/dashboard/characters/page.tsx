import Image from 'next/image';
import CardPreview from '@/app/ui/characters/CardPreview';
import {
  BrujahLogo,
  BrujahTitle,
  VentrueLogo,
  VentrueTitle,
} from '@/app/ui/svgs';

export default function Page() {
  return (
    <div>
      <h1 className='text-slate-300'>
        CHARACTERS are displayed here in neat little cards, and can navigate to
        their sheets from here.
      </h1>

      {/* Example Cards */}
      <div className='flex flex-col mx-6 mt-6'>
        <div className='grid sm:grid-cols-1 sm:gap-8 xl:grid-cols-4 gap-10'>
          <div className='hidden md:flex flex-col col-span-2 order-1'>
            <CardPreview
              characterImage={
                <Image
                  src={'/Brujah.jpg'}
                  width={'150'}
                  height={'70'}
                  alt='character image'
                  className='rounded-full xl:h-36 xl:w-36'
                />
              }
              characterName='Jacques Sauvage'
              description='Impatient, hot-headed enforcer of the Anarachs. Loyal to
                        The Movement through and through. Runs an establishment called The Last Stand.'
              clanTitle={<BrujahTitle className='text-slate-300 h-3 md:h-5' />}
              clanLogo={<BrujahLogo className='text-slate-300 h-6' />}
            />
          </div>
          <div className='flex flex-col col-span-2'>
            <CardPreview
              characterImage={
                <Image
                  src={'/Ventrue.jpg'}
                  width={'150'}
                  height={'0'}
                  alt='character image'
                  className='rounded-full h-24 w-24 xl:h-36 xl:w-36 mt-2'
                />
              }
              characterName='Ailah Al-Malik'
              description='Ruthless leader of the Glasgow Camarilla. Calculated, cold, and cruel. Their servants are terrified of them, and for good measure.'
              clanTitle={<VentrueTitle className='text-slate-300 h-3 md:h-5' />}
              clanLogo={<VentrueLogo className='text-slate-300 h-3 md:h-5' />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
