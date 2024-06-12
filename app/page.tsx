import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Elysium',
};

import Navbar from '@/app/ui/navbar';
import Footer from '@/app/ui/home/Footer';
import HomePageArt from './ui/home/HomePageArt';
import WelcomeText from './ui/home/WelcomeText';
import Image from 'next/image';
import Features from './ui/home/Features';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className='z-10 relative flex h-screen flex-col items-center xl:overscroll-contain mx-1'>
        <HomePageArt />
        <WelcomeText />
      </main>
      <section
        id='features'
        className='z-30 relative flex w-screen h-full bg-black'
      >
        <div className='absolute flex flex-col items-center w-screen lg:w-full bg-gradient-to-t from-black from-90% shadow-xl shadow-black'>
          <Features />
          <Footer />
        </div>
      </section>

      {/* <section className='footer z-30 relative flex w-screen h-screen lg:flex lg:w-screen lg:h-screen bg-gradient-to-b from-violet-950 dark:from-red-950 from-5% dark:to-black to-black to-90%  bg-opacity-100'>
        <Footer />
      </section> */}
    </>
  );
}
