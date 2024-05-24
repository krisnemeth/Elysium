import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Elysium',
};

import Navbar from '@/app/ui/navbar';
import Footer from '@/app/ui/footer';
import GlowUpCard from './ui/home/GlowUpCard';
import HomePageArt from './ui/home/HomePageArt';
import WelcomeText from './ui/home/WelcomeText';
import Image from 'next/image';

import {
  FaSquareXTwitter,
  FaSquareInstagram,
  FaSquareYoutube,
} from 'react-icons/fa6';
import { AiFillTikTok } from 'react-icons/ai';
import { MdArrowOutward } from 'react-icons/md';
import GlowUpButtonMedium from './ui/glowUpButtonMedium';
import LogoGrid from './ui/home/LogoGrid';

export default function Home() {
  let currentYear = new Date().getFullYear();
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
        className='z-30 relative lg:flex w-screen min-h-screen lg:w-screen lg:h-screen bg-gradient-to-t from-black from-90% opacity-95 shadow-xl shadow-black'
      >
        <div className='absolute flex flex-col items-center w-screen lg:w-full opacity-100'>
          <div className='flex w-full items-center justify-center text-slate-300 mt-16 lg:mt-24 xl:pt-2 mb-4'>
            <h2 className='text-xl lg:text-2xl'>Feature Highlights</h2>
          </div>
          <div className='grid grid-cols-1 lg:grid-cols-12 mb-20 w-full bg-black justify-items-center py-10 px-12'>
            <GlowUpCard
              title='Effortless Character Creation'
              description='Build your vampire persona with ease using our intuitive character
              creation tools. From selecting your clan and attributes to defining
              your backstory, Elysium guides you through every step of the
              process.'
            />
            <GlowUpCard
              title='Comprehensive Character Sheets'
              description="Access your character sheet anytime, anywhere. Keep track of your stats, disciplines, and abilities, ensuring you're always ready for the next encounter."
            />
            <GlowUpCard
              title='Mobile Compatibility'
              description="Take Elysium with you wherever you go. Our mobile-friendly interface ensures you're never far from your character, allowing you to dive into the darkness at a moment's notice. "
            />
          </div>
        </div>
      </section>
      <section className='footer z-30 relative lg:flex w-screen min-h-screen lg:w-screen lg:h-screen bg-gradient-to-b from-violet-950 from-5% to-black to-90% opacity-100'>
        {/* GRID */}
        <div className='absolute w-full mt-28'>
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 mx-20'>
            <div className='flex flex-col col-span-6 w-full lg:h-96 ml-1'>
              <div className='flex flex-col h-full py-6'>
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
            <div className='flex flex-col col-span-6 order-1 lg:order-2 w-full lg:h-96 items-center justify-center bg-black border rounded-md border-slate-300/50 shadow-md shadow-black'>
              <h1 className='text-8xl text-slate-300 text-center'>
                <Image
                  src={'/ProductShot.webp'}
                  width={'1000'}
                  height={'0'}
                  alt='character image'
                  className='xl:h-100% xl:w-100%'
                />
              </h1>
            </div>
          </div>
        </div>
        {/* FOOTER */}
        <div className='absolute bottom-0 z-10 w-full text-slate-300/50 bg-clip-padding backdrop-filter backdrop-blur-lg bg-black bg-opacity-80 py-3'>
          <div className='grid grid-cols-12 mx-20 h-64 border rounded-md border-slate-300/50'>
            {/* COL 1 */}
            <div className='flex flex-col col-span-3 items-start text-slate-300 px-4 py-2 m-2'>
              <p className='text-start text-sm'>Contact</p>

              <p className='text-justify text-xs mt-4'>
                <a href='https://krisnemeth.dev'>Developer: Krisztian Nemeth</a>
              </p>
              <p className='text-justify text-xs mt-2'>
                <a href='mailto:krsnmth@gmail.com'>Email: krsnmth@gmail.com</a>
              </p>
              <p className='text-justify text-xs mt-2 '>
                Portfolio:{' '}
                <a
                  href='https://krisnemeth.dev'
                  className='underline underline-offset-1'
                >
                  {' '}
                  krisnemeth.dev
                </a>
              </p>
              <p className='text-start text-xs mt-2'>
                Drop a message with your questions or feedback.
              </p>
            </div>
            {/* COL 2 */}
            <div className='flex flex-col col-span-3 items-start text-slate-300 px-4 py-2 m-2'>
              <p className='text-start text-sm'>Social</p>
              <div className='flex flex-row text-start text-sm mt-4'>
                <a href='#'>
                  <FaSquareXTwitter className='h-4' />
                </a>{' '}
                <p className='ml-1'>Twitter</p>
              </div>
              <div className='flex flex-row text-start text-sm mt-2'>
                <a href='#'>
                  <FaSquareInstagram className='h-4' />
                </a>{' '}
                <p className='ml-1'>Instagram</p>
              </div>
              <div className='flex flex-row text-start text-sm mt-2'>
                <a href='#'>
                  <FaSquareYoutube className='h-4' />
                </a>{' '}
                <p className='ml-1'>Youtube</p>
              </div>
              <div className='flex flex-row text-start text-sm mt-2'>
                <a href='#'>
                  <AiFillTikTok className='h-4' />
                </a>{' '}
                <p className='ml-1'>TikTok</p>
              </div>
            </div>

            {/* COL 3 */}
            <div className='flex flex-col col-span-3 items-start px-4 py-2 m-2'>
              <p className='text-justify text-slate-300 text-sm'>Legal</p>
              <p className='text-justify text-slate-300 text-xs mt-4'>
                All product and company names are trademarks&#8482; or
                registered&#174; trademarks of their respective holders.
              </p>
              <p className='text-justify text-slate-300 text-xs mt-2'>
                <a href='https://www.paradoxinteractive.com/games/world-of-darkness/about'>
                  Vampire: The Masquerade and associated logos, icons, and
                  characters are the property of Paradox Interactive and White
                  Wolf Entertainment. All rights reserved. Used with permission.
                  For more information on Vampire: The Masquerade, please visit
                  the official website Paradox Interactive.
                </a>
              </p>
            </div>
            {/* COL 4 */}
            <div className='flex flex-col col-span-3 items-start border border-slate-300/50 rounded-md px-4 py-2 m-2'>
              <p className='text-start text-slate-300 text-sm'>Sign Up</p>
              <form action='#' className='mt-2 w-full'>
                <div className=''>
                  <label
                    htmlFor='username'
                    className='block text-xs text-slate-300'
                  >
                    Username
                  </label>
                  <input
                    type='text'
                    id='name'
                    className='text-xs text-slate-300 px-2 py-1 mt-0.5 border rounded-md w-full border-slate-300/50 bg-inherit shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent'
                  />
                </div>
                <div className='mt-2'>
                  <label
                    htmlFor='password'
                    className='block text-xs text-slate-300'
                  >
                    Password
                  </label>
                  <input
                    type='text'
                    id='name'
                    className='text-xs text-slate-300 px-2 py-1 mt-0.5 border rounded-md w-full border-slate-300/50 bg-inherit shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent'
                  />
                </div>
                <GlowUpButtonMedium
                  buttonText='Sign Up'
                  buttonHref='#'
                  buttonIcon={
                    <MdArrowOutward className='inline text-xs md:text-sm mb-1' />
                  }
                />
              </form>
            </div>
            <LogoGrid />
          </div>
        </div>
      </section>

      {/* <Footer /> */}
    </>
  );
}
