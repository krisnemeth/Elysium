import Image from 'next/image';
import Link from 'next/link';
import { Jslab, Jsans } from './fonts';
import { Metadata } from 'next';
import {
  AnarchLogo,
  BrujahLogo,
  BrujahTitle,
  VentrueLogo,
  VentrueTitle,
  VtmAnkh,
  VtmLogo,
} from '@/app/ui/svgs';
import Navbar from '@/app/ui/navbar';
import Footer from '@/app/ui/footer';

// import Footer from './ui/footer';

import { GiDrop, GiFangs } from 'react-icons/gi';
import { FaGithubSquare } from 'react-icons/fa';
import { MdArrowDownward } from 'react-icons/md';
import CardPreview from './ui/characters/CardPreview';
import GlowUpButtonLarge from '@/app/ui/glowUpButtonLarge';
import FeatureCard from './ui/home/FeatureCard';

export const metadata: Metadata = {
  title: 'Elysium',
};

export default function Home() {
  return (
    <>
      <Navbar />
      <main className='z-10 relative flex h-screen flex-col items-center xl:overscroll-contain mx-1'>
        {/* Character Art Left and Right */}
        <div className='absolute grid grid-cols-12 lg:gap-4 w-screen h-screen  opacity-100'>
          <div className='flex flex-col col-span-6 lg:col-span-4'>
            <div className=' image-container-left flex '>
              <Image
                src={'/HomepageArtLeft.webp'}
                alt=''
                height={0}
                width={600}
                className='-translate-x-20 translate-y-52 md:-translate-x-6 md:translate-y-[500px] lg:-translate-x-28 lg:translate-y-28 xl:-translate-x-28 xl:translate-y-28 fixed h-fit w-[400px] md:w-[400px] lg:w-[400px] xl:w-[600px]'
              />
            </div>
          </div>
          <div className='hidden lg:flex flex-col col-span-4 items-center justify-center  lg:col-span-4 '></div>
          <div className='flex flex-col col-span-6 lg:col-span-4'>
            <div className='image-container-right flex'>
              <Image
                src={'/HomepageArtRight.webp'}
                alt=''
                height={0}
                width={600}
                className='translate-x-4 translate-y-80 md:-translate-x-56 md:translate-y-68 lg:translate-x-24 lg:translate-y-44 xl:translate-x-28 xl:translate-y-32 fixed h-fit w-[250px] md:w-[700px] lg:w-[400px] xl:w-[600px]'
              />
            </div>
          </div>
        </div>

        {/* Welcome text */}

        <div className=' flex flex-col items-center justify-center mt-2 md:mt-20 lg:mt-48 lg:mx-96'>
          <div className='pt-8 pb-2 md:py-10 text-slate-300'>
            <p className='text-xs text-center md:text-base lg:text-lg xl:text-xl mt-6 px-16'>
              Welcome to
            </p>
            <h1 className='text-5xl md:text-6xl lg:text-7xl xl:text-8xl drop-shadow-2xl text-center tracking-wide bg-gradient-to-r from-violet'>
              Elysium
            </h1>
            <p className='text-xs text-center md:text-base lg:text-base xl:text-xl mt-1 md:px-0 px-16'>
              Are you ready to immerse yourself in the dark and mysterious world
              of Vampire: The Masquerade? Look no further than Elysium, your
              indispensable character management tool designed to elevate your
              gaming experience.
            </p>
            <div className='flex md:hidden flex-row justify-center mt-10'>
              <VtmAnkh className='text-xl text-slate-300 w-20' />
            </div>
          </div>

          <div className='mt-80 md:mt-[700px] lg:mt-6'>
            <a href='#features'>
              <GlowUpButtonLarge
                buttonText='Learn More'
                buttonIcon={
                  <MdArrowDownward className='text-slate-300 text-xl ml-2 mb-1' />
                }
              ></GlowUpButtonLarge>
            </a>
          </div>
        </div>
      </main>
      <section
        id='features'
        className='z-40 relative lg:flex w-screen min-h-screen lg:w-screen lg:h-screen bg-gradient-to-t from-black from-90% opacity-85 '
      >
        <div className='absolute flex flex-col items-center w-screen lg:w-full opacity-100'>
          <div className='flex flex-col items-center justify-center text-slate-300 mt-16 lg:mt-40'>
            <h2 className='text-2xl lg:text-4xl'>Features</h2>
          </div>
          <div className='grid grid-cols-1 lg:grid-cols-12 mx-6 p-6 mt-6 gap-8 w-full bg-black justify-items-center'>
            <FeatureCard
              title='Effortless Character Creation'
              description='Build your vampire persona with ease using our intuitive character
              creation tools. From selecting your clan and attributes to defining
              your backstory, Elysium guides you through every step of the
              process.'
            />
            <FeatureCard
              title='Comprehensive Character Sheets'
              description="Access your character sheet anytime, anywhere. Keep track of your stats, disciplines, and abilities, ensuring you're always ready for the next encounter."
            />
            <FeatureCard
              title='Interactive Storytelling'
              description="Seamlessly integrate your character's narrative into the game with our loresheets. Record your character's experiences, relationships, and decisions, enriching the tapestry of your adventures."
            />
            <FeatureCard
              title='Mobile Compatibility'
              description="Take Elysium with you wherever you go. Our mobile-friendly interface ensures you're never far from your character, allowing you to dive into the darkness at a moment's notice."
            />
          </div>
          <div className='flex flex-col w-full px-4 lg:px-24 text-slate-300 mb-0 bg-black py-10'>
            <p className='text-sm mx-6 text-justify lg:text-lg lg:px-16'>
              Experience Vampire: The Masquerade like never before with Elysium
              by your side. Sign up now and embark on a journey into the
              shadows, where intrigue, betrayal, and eternal power await.
            </p>
            <p className='md:hidden relative text-justify text-slate-300 text-xs mx-6 mt-6'>
              &copy;2024 Elysium. All Rights Reserved. All product and company
              names are trademarks&#8482; or registered&#174; trademarks of
              their respective holders.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
