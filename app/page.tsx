import { Metadata } from 'next';
import Navbar from '@/app/ui/navbar';
import Hero from '@/app/ui/home/Hero';
import Features from '@/app/ui/home/Features';
import Clans from '@/app/ui/home/Clans';
import CallToAction from '@/app/ui/home/CallToAction';
import Footer from '@/app/ui/home/Footer';

export const metadata: Metadata = {
  title: 'Elysium',
};

export default function Home() {
  return (
    <>
      <a
        href='#main'
        className='sr-only z-[60] rounded-md bg-bone px-4 py-2 text-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3'
      >
        Skip to content
      </a>
      <Navbar />
      <main id='main' className='bg-ink'>
        <Hero />
        <Features />
        <Clans />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
