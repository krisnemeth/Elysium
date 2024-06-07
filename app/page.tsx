import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Elysium',
};

import Navbar from '@/app/ui/navbar';
import Footer from '@/app/ui/home/Footer';
import GlowUpCard from './ui/home/GlowUpCard';
import HomePageArt from './ui/home/HomePageArt';
import WelcomeText from './ui/home/WelcomeText';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className='z-10 relative flex h-screen flex-col items-center xl:overscroll-contain mx-1'>
        <HomePageArt />
        {/* Welcome text */}
        <WelcomeText />
      </main>
      <section
        id='features'
        className='z-30 relative lg:flex w-screen min-h-screen h-screen lg:w-screen lg:h-screen bg-gradient-to-t from-black from-90% opacity-95 shadow-xl shadow-black'
      >
        <div className='absolute flex flex-col items-center w-screen lg:w-full opacity-100'>
          <div className='flex w-full items-center justify-center text-slate-300 mt-16 lg:mt-24 xl:pt-2 mb-2'>
            <h2 className='text-xl lg:text-2xl'>Feature Highlights</h2>
          </div>
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 mb-20 w-full py-10 px-2'>
            <GlowUpCard
              title='Effortless Character Creation'
              description='Build your vampire persona with ease using our intuitive character
              creation tools. From selecting your clan and attributes to hashing out
              your backstory in extent, Elysium guides you through every step of the
              process.'
            />
            <GlowUpCard
              title='Comprehensive Character Sheets'
              description="Access your character sheet anytime, anywhere. Keep track of your stats, disciplines, and abilities, ensuring you're always ready for the next encounter."
            />
            <GlowUpCard
              title='Mobile Compatibility'
              description="Take Elysium with you wherever you go. Our mobile and tablet-friendly interface ensures you're never far from your character, allowing you to dive into the darkness at a moment's notice. "
            />
            <GlowUpCard
              title='Dice Roller by Gabor Pfalzer'
              description="Forgot your dice? No problem. You'll have access to a dice roller on you dashboard ensuring you're always ready to roll, no matter where you are. "
            />
          </div>
        </div>
      </section>

      <section className='footer z-30 relative flex w-screen h-screen lg:flex lg:w-screen lg:h-screen bg-gradient-to-b from-violet-950 dark:from-red-950 from-5% dark:to-black to-black to-90%  bg-opacity-100'>
        {/* GRID */}
        <div className='absolute w-full mt-0 md:mt-24'>
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 mx-4 md:mx-2'>
            <div className='flex flex-col col-span-6 w-full h-full ml-1'>
              <div className='flex flex-col h-full py-6 px-20'>
                <p className='text-xs lg:text-base text-slate-300  mt-16'>
                  Manage your characters
                </p>
                <h4 className='text-xl lg:text-4xl  text-slate-300  mt-2 lg:mt-4'>
                  The best way there is.
                </h4>
                <p className='text-xs lg:text-base text-slate-300  mt-2 lg:mt-4'>
                  Whether you&apos;re a seasoned player or a newcomer finding
                  your way, our intuitive interface and rich features will guide
                  you every step of the way.
                </p>
                <p className='text-base text-slate-300 mt-2 lg:mt-4'>
                  Try our app today, and let your story unfold!
                </p>
              </div>
            </div>
            <div className='flex flex-col col-span-6 order-1 lg:order-2 w-full h-full items-center justify-center shadow-md shadow-black'>
              <h1 className='text-8xl text-slate-300 text-center'>
                <Image
                  src={'/ProductShot.webp'}
                  width={'1000'}
                  height={'0'}
                  alt='character image'
                  className='xl:h-100% xl:w-100% border rounded-xl border-slate-300/50'
                />
              </h1>
            </div>
          </div>
        </div>
        <Footer />
      </section>

      {/* <Footer /> */}
    </>
  );
}
