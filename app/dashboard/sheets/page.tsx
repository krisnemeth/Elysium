import GlowUpButtonMedium from '@/app/ui/glowUpButtonMedium';
import { Metadata } from 'next';
import React from 'react';
import { FaPlus } from 'react-icons/fa';

export const metadata: Metadata = {
  title: 'Sheets',
};

export default function Sheets() {
  return (
    <div className='flex flex-col  h-full w-full text-slate-300/80'>
      <div className='flex flex-col bg-black p-4 items-center border border-slate-300/50 rounded-lg'>
        <h1 className='text-xl'>Sheet Management</h1>
      </div>
      <div className='flex flex-col items-center mt-4'>
        <div className='grid grid-cols-12 gap-4 w-full'>
          <div className='flex flex-col w-full col-span-6 border border-slate-300/50 rounded-lg bg-black shadow-md shadow-black'>
            <div className='flex flex-col p-6'>
              <h2 className='text-xl'>Lore Sheets</h2>
              <h3 className='text-base mt-4 text-justify'>
                Here, you can create new Loresheets for your characters, where
                you can describe their backstories, embrace, relationships,
                descriptions of them and their properties, lovers, ghouls
                anything in great detail. This is the more detailed, creative
                part of the character development.
              </h3>
              <div className='mt-6'>
                <GlowUpButtonMedium
                  buttonText='Create New'
                  buttonIcon={<FaPlus className='inline h-3 ml-2' />}
                  buttonHref='./sheets/create'
                ></GlowUpButtonMedium>
              </div>
            </div>
          </div>
          <div className='flex flex-col w-full col-span-6 border border-slate-300/50 rounded-lg bg-black shadow-md shadow-black'>
            <div className='flex flex-col p-6'>
              <h2 className='text-xl'>Character Sheets</h2>
              <h3 className='text-base mt-4 text-justify'>
                Here, you can create new Character Sheets for your characters,
                where you can describe their stats, skills, disciplines, merits,
                flaws, and other mechanical aspects of the character. This is
                the more mechanical, but just as important part of the character
                creation.
              </h3>
              <div className='mt-6'>
                <GlowUpButtonMedium
                  buttonText='Create New'
                  buttonIcon={<FaPlus className='inline h-3 ml-2' />}
                  buttonHref='./sheets/create'
                ></GlowUpButtonMedium>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
