import CategoryDividers from '@/app/ui/sheets/CategoryDividers';
import Attributes from '@/app/ui/sheets/Attributes';
import Skills from '@/app/ui/sheets/Skills';
import LifeStats from '@/app/ui/sheets/LifeStats';
import TextInputFields from '@/app/ui/sheets/TextInputFields';

import { Metadata } from 'next';
import { VtmLogo } from '@/app/ui/svgs';
import Disciplines from '@/app/ui/sheets/Disciplines';
import ResonanceHunger from '@/app/ui/sheets/ResonanceHunger';
import TenetsTouchstonesBane from '@/app/ui/sheets/TenetsTouchstonesBane';
import MixedSection from '@/app/ui/sheets/MixedSection';

export const metadata: Metadata = {
  title: 'Create New Character',
};

export default function CreateSheet() {
  return (
    <>
      <div className='flex flex-col items-center mx-0 p-4 border border-slate-300/50 rounded-xl bg-black shadow-md shadow-black'>
        <h1 className='text-2xl text-slate-300/80'>Character Sheet</h1>
      </div>
      <div className='w-full border border-slate-300/80 rounded-lg xl:px-0 2xl:px-44 shadow-xl shadow-black mt-2 md:mt-4'>
        <div className='flex flex-col items-center mt-6 mb-6'>
          <VtmLogo className='h-16 xl:h-28 text-slate-300/80' />
        </div>
        <form action=''>
          <TextInputFields />
          <CategoryDividers title='Attributes' />
          <Attributes />
          <CategoryDividers title='Skills' />
          <Skills />
          <LifeStats />
          <CategoryDividers title='Disciplines' />
          <Disciplines />
          <ResonanceHunger />
          <TenetsTouchstonesBane />
          <MixedSection />
        </form>
      </div>
    </>
  );
}
