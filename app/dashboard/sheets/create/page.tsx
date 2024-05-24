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
    <div className='w-full border-2 border-slate-300 xl:px-0 2xl:px-44'>
      <div className='flex flex-col items-center mt-6 mb-6'>
        <VtmLogo className='h-16 xl:h-28 text-slate-300' />
        <h1 className='text-slate-300 text-lg xl:text-3xl'>Character Sheet</h1>
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
  );
}
