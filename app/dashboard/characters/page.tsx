import Image from 'next/image';
import CardPreview from '@/app/ui/characters/CardPreview';

import {
  BrujahLogo,
  BrujahTitle,
  TremereLogo,
  TremereTitle,
  VentrueLogo,
  VentrueTitle,
  BanuHaqimLogo,
  BanuHaqimTitle,
  LasombraLogo,
  LasombraTitle,
  MalkavianLogo,
  MalkavianTitle,
  GangrelLogo,
  GangrelTitle,
  NosferatuLogo,
  NosferatuTitle,
} from '@/app/ui/svgs';

export default function Page() {
  return (
    <div className='flex flex-col'>
      <div className='flex flex-col items-center mx-2 p-4 border border-slate-300/50 rounded-xl bg-black'>
        <h1 className='text-2xl text-slate-300'>Characters</h1>
      </div>
      <div className='flex flex-col items-center  px-2 pt-4'>
        <div className='grid grid-cols-1 xl:grid-cols-12 gap-2 xl:gap-4 w-full mb-40'>
          <CardPreview
            characterImage={
              <Image
                src='/Female1.jpg'
                alt='Character Image'
                width={220}
                height={220}
                className='xl:h-52 bg-cover xl:bg-center bg-no-repeat rounded-sm object-cover'
              />
            }
            characterName='Trixx Laveau'
            description="Anarch enforcer and true believer of The Cause. Right hand to the Anarch leader. If you don't want trouble, stay out of her way."
            clanTitle={
              <BrujahTitle className='h-6 xl:h-12 w-auto text-slate-300' />
            }
            clanLogo={
              <BrujahLogo className='h-4 xl:h-8 w-auto text-slate-300' />
            }
          />
          <CardPreview
            characterImage={
              <Image
                src='/Tremere.jpg'
                alt='Character Image'
                width={220}
                height={0}
                className='xl:h-52 bg-cover xl:bg-center bg-no-repeat rounded-sm object-cover'
              />
            }
            characterName='Agatha Ramalho'
            description='Prefers their books to people. A Tremere scholar, they are the keeper of the Chantry library and the local expert on all things occult.'
            clanTitle={
              <TremereTitle className='h-4 xl:h-8 w-auto text-slate-300' />
            }
            clanLogo={
              <TremereLogo className='h-4 xl:h-6 w-auto text-slate-300' />
            }
          />
          <CardPreview
            characterImage={
              <Image
                src='/Ventrue.jpg'
                alt='Character Image'
                width={220}
                height={0}
                className='xl:h-52 bg-cover xl:bg-center bg-no-repeat rounded-sm object-cover'
              />
            }
            characterName='Ailah Al-Malik'
            description='Merciless leader of the Glasgow Camarilla. She is a Ventrue through and through, and she will do anything to keep her power.'
            clanTitle={
              <VentrueTitle className='h-4 xl:h-8 w-auto text-slate-300' />
            }
            clanLogo={<VentrueLogo className='h-4 xl:h-6 w-6 text-slate-300' />}
          />
          <CardPreview
            characterImage={
              <Image
                src='/Male1.jpg'
                alt='Character Image'
                width={220}
                height={0}
                className='xl:h-52 bg-cover xl:bg-center bg-no-repeat rounded-sm object-cover'
              />
            }
            characterName='Vic Vargas'
            description='Judge, jury, and executioner. Local Sheriff, the assassins of the Camarilla, and they are feared by all.'
            clanTitle={
              <BanuHaqimTitle className='h-4 xl:h-8 w-auto text-slate-300' />
            }
            clanLogo={
              <BanuHaqimLogo className='h-4 xl:h-6 w-6 text-slate-300' />
            }
          />
          <CardPreview
            characterImage={
              <Image
                src='/Female3.jpg'
                alt='Character Image'
                width={220}
                height={0}
                className='xl:h-52 bg-cover xl:bg-center bg-no-repeat rounded-sm object-cover'
              />
            }
            characterName="Ada O'Connor"
            description='Recently arrived in the city, she is a Lasombra Ancilla with a mysterious past. She is a skilled manipulator and a master of shadows.'
            clanTitle={
              <LasombraTitle className='h-4 xl:h-8 w-auto text-slate-300' />
            }
            clanLogo={
              <LasombraLogo className='h-4 xl:h-6 w-6 text-slate-300' />
            }
          />
          <CardPreview
            characterImage={
              <Image
                src='/Malkavian.jpg'
                alt='Character Image'
                width={220}
                height={0}
                className='xl:h-52 bg-cover xl:bg-center bg-no-repeat rounded-sm object-cover'
              />
            }
            characterName='Claire Voyant'
            description='Bearer of headaches, a Malkavian seer, she is the local oracle. She is cryptic, but her predictions are always accurate.'
            clanTitle={
              <MalkavianTitle className='h-4 xl:h-8 w-auto text-slate-300' />
            }
            clanLogo={
              <MalkavianLogo className='h-4 xl:h-6 w-6 text-slate-300' />
            }
          />
          <CardPreview
            characterImage={
              <Image
                src='/Gangrel.jpg'
                alt='Character Image'
                width={220}
                height={0}
                className='xl:h-52 bg-cover xl:bg-center bg-no-repeat rounded-sm object-cover'
              />
            }
            characterName='Chelsea Grimm'
            description="A Gangrel loner, she is a fierce protector of the city's parks. She is a wild card, but she is loyal to her friends. Loves spiders."
            clanTitle={
              <GangrelTitle className='h-4 xl:h-8 w-auto text-slate-300' />
            }
            clanLogo={<GangrelLogo className='h-4 xl:h-6 w-6 text-slate-300' />}
          />
          <CardPreview
            characterImage={
              <Image
                src='/Nosferatu.jpeg'
                alt='Character Image'
                width={220}
                height={220}
                className='xl:h-52 bg-cover bg-center bg-no-repeat rounded-sm object-cover'
              />
            }
            characterName='Blake Janssen'
            description='Nosferatu spymaster, he knows everything about everyone. He is the keeper of secrets and the master of the shadows.'
            clanTitle={
              <NosferatuTitle className='h-4 xl:h-8 w-auto text-slate-300' />
            }
            clanLogo={
              <NosferatuLogo className='h-4 xl:h-6 w-6 text-slate-300' />
            }
          />
        </div>
      </div>
    </div>
  );
}
