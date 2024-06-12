import React from 'react';
import Image from 'next/image';
import GlowUpCard from './GlowUpCard';

export default function Features() {
  return (
    <>
      <div className='flex w-full items-center justify-center text-slate-300 mt-16 lg:mt-24 xl:py-2 mb-2 '>
        <h2 className='text-xl lg:text-2xl'>Feature Highlights</h2>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-6 md:mb-20 w-full py-4 px-2'>
        <GlowUpCard
          image={
            <Image
              src='/MobileShots.png'
              alt='?'
              width={1000}
              height={0}
              className='xl:h-100% xl:w-100% border rounded-lg border-slate-300/50'
            />
          }
          title='Effortless Character Management'
          description='Build your vampire persona with ease using our intuitive character
            creation tools. From selecting your clan and attributes to hashing out
            your backstory in extent, Elysium guides you through every step of the
            process.'
        />
        <GlowUpCard
          image={
            <Image
              src='/MobileShots.png'
              alt='?'
              width={1000}
              height={0}
              className='xl:h-100% xl:w-100% border rounded-lg border-slate-300/50'
            />
          }
          title='Comprehensive Character Sheets'
          description="Access your character sheet anytime, anywhere. Keep track of your stats, disciplines, and abilities, ensuring you're always ready for the next encounter."
        />
        <GlowUpCard
          image={
            <Image
              src='/MobileShots.png'
              alt='?'
              width={1000}
              height={0}
              className='xl:h-100% xl:w-100% border rounded-lg border-slate-300/50'
            />
          }
          title='Mobile & Tablet Compatibility'
          description="Take Elysium with you wherever you go. Our mobile and tablet-friendly interface ensures you're never far from your character, allowing you to dive into the darkness at a moment's notice. "
        />
        <GlowUpCard
          image={
            <Image
              src='/DiceRollShot.png'
              alt='?'
              width={1000}
              height={0}
              className='xl:h-100% xl:w-100% border rounded-lg border-slate-300/50'
            />
          }
          title='Dice Roller by Gabor Pfalzer'
          description="Forgot your dice? No problem. You'll have access to a dice roller on you dashboard ensuring you're always ready to roll, no matter where you are. "
        />
      </div>
      ;
    </>
  );
}
