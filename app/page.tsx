import Image from 'next/image';
import Link from 'next/link';
import { Jslab, Jsans } from './fonts';
import { Metadata } from 'next';
import { AnarchLogo, BrujahLogo, VtmAnkh, VtmLogo } from '@/app/ui/svgs';
import Navbar from '@/app/ui/navbar';

import { BrujahClan } from '@/app/ui/svgs';
// import Footer from './ui/footer';

import { GiDrop, GiFangs } from 'react-icons/gi';
import { FaGithubSquare } from 'react-icons/fa';
import { MdArrowOutward } from 'react-icons/md';

export const metadata: Metadata = {
  title: 'Elysium',
};

export default function Home() {
  return (
    <>
      <main className='relative flex h-screen flex-col items-center overscroll-contain'>
        <Navbar />

        <div className='flex flex-col items-center justify-center mt-48 mx-96'>
          <div className='py-16 px-24 text-slate-300'>
            <h2 className='text-6xl drop-shadow-2xl text-center'>
              Master the Shadows
            </h2>
            <p className='text-lg mt-4'>
              Unveil the secrets of the night as you immerse yourself in the
              World Of Darkness with our companion app.
            </p>
          </div>

          <div className='flex flex-col w-full mt-2'>
            <div className='grid grid-cols-4 gap-10'>
              <div className='flex flex-col col-span-2 border-2 border-slate-300 bg-black rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-60'>
                <div className='flex flex-col text-slate-300'>
                  <div className='grid grid-cols-4'>
                    <div className='flex flex-col col-span-1 p-2 border-2 border-slate-300 items-center'>
                      <Image
                        src={'/enforcer.png'}
                        width={'100'}
                        height={'70'}
                        alt='character image'
                        className='rounded-full'
                      />
                      <BrujahLogo className='h-18 text-slate-300' />
                    </div>
                    <div className='flex flex-col col-span-3 border-2 border-slate-300'>
                      <h3 className='text-2xl pt-5 px-2'>Jacques Sauvage</h3>
                      <div className='flex items-start pt-2 px-2'>
                        <BrujahClan className='text-slate-300 h-7' />
                      </div>
                      <p className='text-lg text-justify pt-6 px-2'>
                        Impatient, hot-headed enforcer of the Anarachs. Loyal to
                        The Movement through and through.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex flex-col col-span-2 border-2 border-slate-300'>
                <p className='text-white'>CARD 2</p>
              </div>
            </div>
          </div>

          <div className='mt-36'>
            <div className='relative group'>
              <div className='absolute -inset-0.5 bg-gradient-to-r from-rose-600 to-violet-600 dark:from-pink-600 dark:to-violet-600 rounded-lg blur-md opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 w-96'></div>
              <button className='relative flex items-center justify-center bg-black px-4 py-2 text-slate-300 rounded-lg group-hover:text-slate-100 transition duration-200 ease-in-out w-96'>
                <span className='text-lg'>
                  Get Started <MdArrowOutward className='inline text-xl mb-1' />
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* <div className='absolute grid grid-cols-12 border-2 w-full '>
          <div className='relative flex h-full flex-col w-full items-center justify-center col-span-2'>
            <div className='relative'>
              <div className='absolute inset-y-5 blur-xl'>
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
        {/* <Footer /> */}
      </main>
    </>
  );
}
