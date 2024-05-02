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
import { MdArrowOutward } from 'react-icons/md';
import CardPreview from './ui/characters/CardPreview';
import GlowUpButtonLarge from '@/app/ui/glowUpButtonLarge';

export const metadata: Metadata = {
  title: 'Elysium',
};

export default function Home() {
  return (
    <>
      <main className='relative flex h-screen flex-col items-center xl:overscroll-contain mx-1'>
        <Navbar />

        {/* Welcome text */}

        <div className='flex flex-col items-center justify-center mt-20 xl:mt-36 xl:mx-80'>
          <div className='pt-10 pb-2 md:py-10 text-slate-300'>
            <h2 className='text-3xl lg:text-4xl xl:text-6xl drop-shadow-2xl text-center'>
              Master the Shadows
            </h2>
            <p className='text-sm text-center lg:text-lg mt-6 px-6'>
              Manage characters of the night as you immerse yourself in Vampire:
              The Masquerade with our companion app.
            </p>
          </div>
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
                  Logo={<BrujahLogo className='text-slate-300 h-6' />}
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
                  Logo={<VentrueLogo className='text-slate-300 h-3 md:h-5' />}
                />
              </div>
            </div>
          </div>

          {/* <div className='flex items-center text-slate-300 mt-4 md:mt-10 mx-6'>
            <p className='text-sm text-center mt-4'>
              Are you ready to embark on your character creation journey?
            </p>
          </div> */}

          <div className='mt-20'>
            <GlowUpButtonLarge
              buttonText='Get Started'
              buttonIcon={
                <MdArrowOutward className='text-slate-300 text-xl ml-2 mb-1' />
              }
            ></GlowUpButtonLarge>
          </div>
        </div>

        {/* <div classNameName='absolute grid grid-cols-12 border-2 w-full '>
          <div classNameName='relative flex h-full flex-col w-full items-center justify-center col-span-2'>
            <div classNameName='relative'>
              <div classNameName='absolute inset-y-5 blur-xl'>
                <VtmAnkh className=' text-rose-600 text-6xl w-48' />
              </div>
              <VtmAnkh className='relative text-black text-6xl w-48 drop-shadow-[0_0_0.3rem_#f43f5e80]' />
            </div>
          </div>
          <div className='relative flex h-full  flex-col w-full items-center justify-center col-span-8 bg-black rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-40'>
            <div className='relative '>
              <div className='absolute inset-y-5 blur-xl'>
                <VtmAnkh className=' text-rose-600 text-6xl w-48' />
              </div>
              <VtmAnkh className='relative text-black text-6xl w-48 drop-shadow-[0_0_0.3rem_#f43f5e80]' />
            </div>
          </div>
          <div className='relative flex h-full flex-col w-full items-center justify-center col-span-2'>
            <div className='relative'>
              <div className='absolute inset-y-5 blur-xl'>
                <VtmAnkh className=' text-rose-600 text-6xl w-48' />
              </div>
              <VtmAnkh className='relative text-black text-6xl w-48 drop-shadow-[0_0_0.3rem_#f43f5e80]' />
            </div>
          </div>
        </div> */}

        {/* GRID */}
        {/* <div className='absolute flex flex-col w-full h-full px-6 justify-between mt-14'>
          
          <div className='grid grid-cols-12 grid-rows-2 gap-10 mt-6'>
            <div className='flex flex-col text-start row-span-2 col-span-4 h-full'>
              <div className='h-full w-full bg-black rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-20 '>
                <div className='flex flex-col text-justify text-slate-300 h-full p-8'>
                  <p className='text-base'>Welcome to</p>
                  <h1 className='text-5xl pt-6'>Elysium</h1>
                  <p className='text-base pt-6'>
                    This is a companion to the popular tabletop roleplaying game
                    `Vampire: The Masquerade` where you can create, edit and
                    store your characters. I am a huge fan of the game, and I
                    wanted to create a tool that would help others keep track of
                    their characters, and allow them to update character sheets
                    suring sessions.
                  </p>
                  <p className='text-base pt-6'>
                    This project is brought to you by Krisztian Nemeth. It is
                    still well under construction. If you would like to
                    contribute, please check out the repo on GitHub, or if you
                    want to see more of my work, check my portfolio.
                  </p>
                </div>
              </div>
            </div>
            <div className='flex flex-col col-span-4 h-full'></div>
            <div className='flex flex-col col-span-4 h-full'>
              <div className=' bg-black rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-20 col-span-3'>
                <div className='p-8 text-slate-300 text-justify'>
                  <div className='flex justify-between'>
                    <h2 className='text-xl font-extrabold'>
                      Soaring Leap Back In
                    </h2>
                    <GiFangs className='text-2xl mb-1' />
                  </div>

                  <p className='pt-8'>
                    You know what you're doing. Get back to work and add or edit
                    characters or update sheets during a session.
                  </p>
                </div>
                <div className='flex justify-end px-8 pb-4'>
                  <div className='relative group'>
                    <div className='absolute -inset-0.5 bg-gradient-to-r from-rose-600 to-violet-600 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 w-36'></div>
                    <button className='relative flex items-center justify-center bg-black px-4 py-2 text-slate-300 rounded-lg group-hover:text-slate-100 transition duration-200 ease-in-out w-36'>
                      <span className='text-lg'>
                        Log In{' '}
                       
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className='flex flex-col col-span-4 h-full'></div>
            <div className=' bg-black rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-20  col-span-4'>
              <div className='p-8 text-slate-300 text-justify'>
                <div className='flex justify-between'>
                  <h2 className='text-xl font-extrabold'>Start Your Journey</h2>
                  <GiDrop className='text-2xl mb-1' />
                </div>

                <p className='pt-8'>
                  If you're new here, do not fret. Create an account, and
                  Embrace the Night. What could possibly go wrong...?
                </p>
              </div>
              <div className='flex justify-end px-8 pb-4'>
                <div className='relative group'>
                  <div className='absolute -inset-0.5 bg-gradient-to-r from-rose-600 to-violet-600 rounded-lg blur-lg opacity-65 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 w-36'></div>
                  <button className='relative flex items-center justify-center bg-black px-4 py-2 text-slate-300 rounded-lg group-hover:text-slate-100 transition duration-200 ease-in-out w-36'>
                    <span className='text-lg'>
                      Sign Up <MdArrowOutward className='inline text-xl mb-1' />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
         
          
        </div> */}
        <Footer />
      </main>
    </>
  );
}
